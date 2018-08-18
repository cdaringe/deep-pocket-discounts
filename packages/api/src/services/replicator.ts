import { Pocket } from '../interfaces'
import fetch from 'node-fetch'
import * as bluebird from 'bluebird'

export enum States {
  Running,
  Stopped,
  Started,
  Errored
}

export interface IReplicate {
  concurrency?: number
  db: Pocket.IDb
}

export class Replicator {
  public ids: number[]
  public logger: Pocket.Logger
  public force: boolean
  public progress: { incomplete: number; complete: number }
  public state: States
  public url: string
  public resource: (id: number) => string

  constructor (opts: Pocket.IReplicatorConfig & { logger: Pocket.Logger }) {
    const { force, ids, logger, resource, url } = opts
    Object.assign(this, { force, ids, logger, resource, url })
    this.state = States.Stopped
    this.progress = { incomplete: this.ids.length, complete: 0 }
  }

  async fetchSingle (uri: string) {
    const res = await fetch(uri, { method: 'get' })
    return res.json()
  }

  async replicate (opts: IReplicate) {
    const { concurrency = 1, db } = opts
    try {
      await bluebird.map(
        this.ids,
        async id => {
          await this.replicateSingle(db, id)
          const complete = this.progress.complete + 1
          const incomplete = this.progress.incomplete - 1
          this.progress = { complete, incomplete }
        },
        { concurrency }
      )
    } catch (err) {
      this.state = States.Errored
      this.logger.error('failed to replicate')
      // for the sake of demo, don't kill the service as we usually would.
      // there is no recovery for this. swallow the error
      this.logger.error(err)
    }
  }

  async replicateSingle (db: Pocket.IDb, id: number) {
    const existing = await db.readAsync(id.toString())
    if (existing !== undefined) {
      if (this.force) {
        this.logger.info(`refreshing existing item id ${id}`)
      } else {
        this.logger.info(`item id ${id} already in database. skipping`)
        return
      }
    }
    const uri = `${this.url}${this.resource(id)}`
    this.logger.info(`fetching id ${id}`)
    // replicate intentionally slow for visual demo effect
    await bluebird.delay(1000)
    const json = await this.fetchSingle(uri)
    await db.writeAsync(id.toString(), json)
  }
}

export function service (opts: Pocket.IServiceInputs) {
  const { services: { db, logger } } = opts
  if (!db) throw new Error('db not available')
  const replicator = new Replicator({
    ...opts.config.services.replicator,
    logger
  })
  return replicator
}
