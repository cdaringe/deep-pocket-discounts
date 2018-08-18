import { Pocket } from '../interfaces'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as bluebird from 'bluebird'

const toilet = require('toiletdb')

export async function service (
  opts: Pocket.IServiceInputs
): Promise<Pocket.IDb> {
  const { services: { logger } } = opts
  const dbFilename = opts.config.services.db.filename
  logger.debug(`upserting database directory: ${dbFilename}`)
  await fs.mkdirp(path.dirname(dbFilename))
  const db = bluebird.promisifyAll(toilet(dbFilename))
  await db.openAsync()
  return db
}
