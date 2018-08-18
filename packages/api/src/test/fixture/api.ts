import { defaultsDeep } from 'lodash'
import { freeport } from './util/freeport'
import { Pocket, Service } from '../../index'
import { promisify } from 'util'
import { StackContext } from './stack'
import * as fs from 'fs-extra'
import * as request from 'supertest'
import * as tmp from 'tmp'
import retry = require('promise-retry')
import { fixture as db } from './db'

const DB_FIXTURE = JSON.stringify(db, null, 2)

async function createTempDbFile () {
  const filename = await promisify(tmp.tmpName.bind(tmp))()
  await fs.writeFile(filename, DB_FIXTURE)
  return filename
}

export interface ApiContext {
  apiService: Service
}

export async function setup (
  ctx: Partial<StackContext>,
  opts?: Partial<Pocket.IServiceConfig>
) {
  const [port, dbFilename] = await Promise.all([freeport(), createTempDbFile()])
  const service = new Service()
  const config: Partial<Pocket.IServiceConfig> = defaultsDeep(opts || {}, {
    logger: {
      name: 'testlogger',
      level: 'silent',
      prettyPrint: true
    },
    server: {
      port
    },
    services: {
      db: {
        filename: dbFilename
      }
    }
  })
  await service.start(config)
  // wait for server to come up!
  await retry(rt =>
    request(service.server)
      .get('/api/hello')
      .expect(200)
      .catch(rt)
  )
  ctx.apiService = service
}

export async function teardown (ctx: ApiContext) {
  await ctx.apiService.stop()
}
