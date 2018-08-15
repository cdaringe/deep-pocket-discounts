import {
  api as createApiMiddlewares,
  common as createCommonMiddlewares
} from './middleware'
import * as routes from './routes'
import { defaultsDeep } from 'lodash'
import { init as initServices } from './services'
import { Pocket } from './interfaces'
import { promisify } from 'bluebird'
import { PUBLIC_DIRNAME } from './constants'
import { resolve } from 'path'
import { Server } from 'http'
import * as common from 'common'
import * as fs from 'fs-extra'
import * as Koa from 'koa'
import * as mount from 'koa-mount'
import * as Router from 'koa-router'
import serve = require('koa-static')
var cors = require('@koa/cors')

export class Service {
  public config: Pocket.IServiceConfig
  public services: Pocket.IServices
  public server: Server

  async createConfig (
    opts: Partial<Pocket.IServiceConfig>
  ): Promise<Pocket.IServiceConfig> {
    const name = process.env.SERVICE_NAME || common.constants.APP_NAME
    return defaultsDeep(opts, {
      name,
      logger: {
        level: process.env.LOG_LEVEL || common.isDev ? 'debug' : 'warn',
        name,
        prettyPrint: common.isDev ? true : !!process.env.PRETTY_REQUEST_LOGGING
      },
      server: {
        port: process.env.PORT ? parseInt(process.env.PORT) : 9090
      },
      services: {
        salesforce: {
          password: process.env.SALESFORCE_PASSWORD,
          token: process.env.SALESFORCE_TOKEN,
          url: process.env.SALESFORCE_URL,
          username: process.env.SALESFORCE_LOGIN
        }
      }
    })
  }

  async createApiServerApp (config: Pocket.IServiceConfig) {
    const app = new Koa()
    const router = new Router()
    const services = await initServices(app, config)
    common.isDev && app.use(cors())
    app.context.services = services
    createApiMiddlewares(config).forEach(mw => app.use(mw))
    await routes.bind(app, router, services)
    return { app, services }
  }

  async createFileServerApp () {
    const app = new Koa()
    const staticHandler = serve(PUBLIC_DIRNAME, { defer: false })
    // serve linked static ui build
    if (common.isDev) {
      const uiBuildDir = resolve(__dirname, '../../ui/build')
      const isUiBuilt = await fs.pathExists(PUBLIC_DIRNAME)
      if (!isUiBuilt) await fs.symlink(uiBuildDir, PUBLIC_DIRNAME)
    }
    app.use((ctx: Koa.Context, next: any) =>
      staticHandler(ctx, async () => {
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

  async start (opts: Partial<Pocket.IServiceConfig>) {
    const config = await this.createConfig(opts)
    const { server: { port } } = config
    const { app: fileserver } = await this.createFileServerApp()
    const { app: api, services } = await this.createApiServerApp(config)
    const { app } = await this.createRootApp(config, services, api, fileserver)
    Object.assign(this, { config, services })
    this.server = app.listen(port)
    services.logger.debug(`configuration: ${JSON.stringify(config, null, 2)}`)
    services.logger.info(`🚀  listening @ http://localhost:${port}`)
  }

  async stop () {
    if (this.server) await promisify(this.server.close.bind(this.server))()
  }
}

export { Pocket }
