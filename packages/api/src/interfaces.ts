import * as Koa from 'koa'
import * as pino from 'pino'

export namespace Pocket {
  export type IServices = {
    logger: pino.Logger
  }

  export interface IServiceConfig {
    db: IServiceDatabaseConfig
    logger: {
      name: string
      level: string
    }
    name: string
    server: {
      port: number
    }
  }

  export interface IServiceDatabaseConfig {
    uri: string
  }

  export interface IServiceInputs {
    app: Koa
    config: IServiceConfig
    services: IServices
  }
}

// extend context to enable us to tack on our own props, which is idiomatic koa
declare module 'koa' {
  export interface BaseContext {
    services: Pocket.IServices
    state: {
      jwt: string
    }
  }
}
