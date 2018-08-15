import { middleware as bodyParser } from './body-parser'
import { middleware as compress } from './compress'
import { middleware as helmet } from './helmet'
import { middleware as logger } from './logger'
import { middleware as responseTime } from './response-time'
import { middleware as simpleResponses } from './simple-responses'
import { Pocket } from '../interfaces'

export const common = function createMiddlewares (
  config: Pocket.IServiceConfig
) {
  const middlewares = [
    responseTime,
    logger(config),
    helmet(),
    bodyParser,
    compress
  ]
  return middlewares
}

export const api = function createMiddlewares (config: Pocket.IServiceConfig) {
  const middlewares = [simpleResponses]
  return middlewares
}
