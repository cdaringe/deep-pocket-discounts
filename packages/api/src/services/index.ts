import { create as createLogger } from './logger'
import { Pocket } from '../interfaces'
import { service as db } from './db'
import { service as replicator } from './replicator'
import * as Koa from 'koa'

export async function init (
  app: Koa,
  config: Pocket.IServiceConfig
): Promise<Pocket.IServices> {
  const logger = createLogger(config.logger)
  var payload: Pocket.IServiceInputs = {
    app,
    config,
    services: {
      logger
    }
  }
  payload.services.db = await db(payload)
  payload.services.replicator = replicator(payload)
  return payload.services
}
