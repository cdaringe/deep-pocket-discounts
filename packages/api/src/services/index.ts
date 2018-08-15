import { create as createLogger } from './logger'
import { Pocket } from '../interfaces'
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
  return payload.services
}
