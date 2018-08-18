import * as Koa from 'koa'
import * as pino from 'pino'
import { Replicator } from './services/replicator'

export namespace Pocket {
  export interface IApisConfig {
    // we only have one api endpoint, items!
    items: {
      url: string
      resource: (id: number) => string
      permittedIds: number[]
    }
  }
  export interface IDb {
    deleteAsync: (key: string) => Promise<any>
    filename: string
    flushAsync: () => Promise<any>
    readAsync: (key?: string) => Promise<any>
    writeAsync: (key: string, value: any) => Promise<any>
  }

  export type Logger = pino.Logger

  export type IServices = {
    db?: IDb
    logger: pino.Logger
    replicator?: Replicator
  }

  export interface IServiceConfig {
    apis: IApisConfig
    dataDirname: string
    logger: {
      name: string
      level: string
      prettyPrint: boolean
    }
    name: string
    server: {
      port: number
    }
    services: {
      db: IServiceDatabaseConfig
      replicator: IReplicatorConfig
    }
  }

  export interface IServiceDatabaseConfig {
    filename: string
  }

  export interface IServiceInputs {
    app: Koa
    config: IServiceConfig
    services: IServices
  }

  export interface IReplicatorConfig {
    enabled?: boolean
    ids: number[]
    refresh: boolean
    resource: (id: number) => string
    url: string
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
