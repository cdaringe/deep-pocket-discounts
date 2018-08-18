import { freeport } from './util/freeport'
import { Pocket, Service } from '../../index'
import { StackContext } from './stack'
import * as request from 'supertest'
import retry = require('promise-retry')

export interface ApiContext {
  apiService: Service
}

export async function setup (ctx: Partial<StackContext>) {
  const port = await freeport()
  const service = new Service()
  const config: Partial<Pocket.IServiceConfig> = {
    logger: {
      name: 'testlogger',
      level: 'silent',
      prettyPrint: true
    },
    server: {
      port
    }
  }
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
