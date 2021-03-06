import {
  api as createApiMiddlewares,
  common as createCommonMiddlewares
} from './middleware'
import * as routes from './routes'
import { defaultsDeep } from 'lodash'
import { homedir } from 'os'
import { init as initServices } from './services'
import { Pocket } from './interfaces'
import { promisify } from 'bluebird'
import { PUBLIC_DIRNAME } from './constants'
import { Server } from 'http'
import * as common from 'common'
import * as fs from 'fs-extra'
import * as Koa from 'koa'
import * as mount from 'koa-mount'
import * as path from 'path'
import * as Router from 'koa-router'
import serve = require('koa-static')
var cors = require('@koa/cors')

export class Service {
  public config: Pocket.IServiceConfig
  public services: Pocket.IServices
  public server: Server

  createConfig (opts: Partial<Pocket.IServiceConfig>): Pocket.IServiceConfig {
    const name = process.env.SERVICE_NAME || common.constants.APP_NAME
    let itemIds
    try {
      itemIds = process.env.REPLICATE_IDS!.split(',').map(i => parseInt(i, 10))
    } catch (err) {
      throw new Error(
        [
          `REPLICATE_IDS must be csv,of,product,IDs (e.g. 1,2,3).`,
          `found: ${process.env.REPLICATE_IDS}`
        ].join(' ')
      )
    }
    if (!process.env.PRODUCT_API_URL) {
      throw new Error('PRODUCT_API_URL not specified')
    }
    if (!process.env.ITEM_API_KEY) throw new Error('ITEM_API_KEY not specified')
    const dataDirname =
      process.env.DATA_DIRNAME || path.resolve(homedir(), '.deep-pockets')
    const url = process.env.PRODUCT_API_URL
    const defaults: Partial<Pocket.IServiceConfig> = {
      apis: {
        items: {
          url,
          permittedIds: itemIds
        }
      },
      dataDirname,
      logger: {
        level: process.env.LOG_LEVEL || common.isDev ? 'debug' : 'info',
        name,
        prettyPrint: common.isDev ? true : !!process.env.PRETTY_REQUEST_LOGGING
      },
      name,
      server: {
        port: process.env.PORT ? parseInt(process.env.PORT) : 9090
      },
      services: {
        db: {
          filename:
            process.env.DB_FILENAME || path.resolve(dataDirname, 'db.json')
        },
        replicator: {
          enabled: !!process.env.ENABLE_REPLICATION,
          ids: itemIds,
          refresh: !!process.env.REFRESH_REPLICATION,
          url
        }
      }
    }
    return defaultsDeep(opts, defaults)
  }

  async createApiServerApp (config: Pocket.IServiceConfig) {
    const app = new Koa()
    const router = new Router()
    const services = await initServices(app, config)
    common.isDev && app.use(cors())
    app.context.services = services
    createApiMiddlewares(config).forEach(mw => app.use(mw))
    await routes.bind(app, config, router, services)
    return { app, services }
  }

  async createFileServerApp () {
    const app = new Koa()
    const staticHandler = serve(PUBLIC_DIRNAME, { defer: false })
    if (common.isDev) {
      // serve linked static ui build
      await fs.mkdirp(path.dirname(PUBLIC_DIRNAME))
      const uiBuildDir = path.resolve(__dirname, '../../ui/build')
      const isUiBuilt = await fs.pathExists(uiBuildDir)
      if (isUiBuilt) {
        try {
          await fs.symlink(uiBuildDir, PUBLIC_DIRNAME)
        } catch (err) {
          if (err.code !== 'EEXIST') throw err
        }
      }
    }
    app.use((ctx: Koa.Context, next: any) =>
      staticHandler(ctx, async () => {
        // on 404, let the web-app handle rendering the route
        if (ctx.status === 404) {
          ctx.body = fs.createReadStream(`${PUBLIC_DIRNAME}/index.html`)
          ctx.type = 'html'
        }
        await next()
      })
    )
    common.isDev && app.use(cors())
    return { app }
  }

  async createRootApp (
    config: Pocket.IServiceConfig,
    services: Pocket.IServices,
    api: Koa,
    fileserver: Koa
  ) {
    const app = new Koa()
    createCommonMiddlewares(config).forEach(mw => app.use(mw))
    app.context.services = services
    app.use(mount('/api', api))
    app.use(mount('/', fileserver))
    return { app }
  }

  /**
   * `start` kicks off most of the heavy lifting of the app.
   * The server hosts multiple sub apps:
   * - a fileserver, for serving the ui assets, &
   * - the api
   * Some may find the name `api` offensive given that the service also serves
   * static ui content.  This is a fair opinion.  Given the tiny role of serving
   * a few static files, I choose to include this functionality over rolling an
   * indepentent fileserver, such as nginx/httpd/etc, as a side car to this app.
   */
  async start (opts: Partial<Pocket.IServiceConfig>) {
    const config = this.createConfig(opts)
    await fs.mkdirp(config.dataDirname)
    const { server: { port } } = config
    const { app: fileserver } = await this.createFileServerApp()
    const { app: api, services } = await this.createApiServerApp(config)
    const { app } = await this.createRootApp(config, services, api, fileserver)
    Object.assign(this, { config, services })
    if (!config.services.replicator.enabled) {
      services.replicator!.replicate({ db: services.db! })
    }
    this.server = app.listen(port)
    services.logger.debug(`configuration: ${JSON.stringify(config, null, 2)}`)
    services.logger.info(`🚀  listening @ http://localhost:${port}`)
  }

  async stop () {
    if (this.server) await promisify(this.server.close.bind(this.server))()
  }
}

export { Pocket }
