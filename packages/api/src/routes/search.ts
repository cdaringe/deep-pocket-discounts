import { Pocket } from '..'
import * as bluebird from 'bluebird'
import * as createDebug from 'debug'
import * as errors from '../errors'
import fetch from 'node-fetch'
import * as JSONStream from 'streaming-json-stringify'
import * as Koa from 'koa'
import * as stream from 'stream'

/**
 * /api/search - search through the walmart item api, looking for keyword matches
 *
 * in a larger environment, we would design in pagination features,
 * using an offset, page size, sorting, etc.
 */
export function get (app: Koa, db: Pocket.IDb, apis: Pocket.IApisConfig) {
  const debug = createDebug('dpd:route:search:get')
  debug('registering get route')

  async function searchCached (keyword: string, stream: stream.Transform) {
    // this file based db implementation has no cursors, otherwise we'd:
    //  - stream thru our records, applying our filter, & pipe to the client, or, more likely
    //  - offload the query to the db engine, & stream/pipe the results to the client
    const catalog = await db.readAsync()
    const matcher = new RegExp(keyword, 'i')
    Object.values(catalog)
      .filter((item: any) => item.longDescription.match(matcher))
      .forEach((item: any) => stream.write(item.itemId))
    stream.end()
  }

  async function searchLive (
    keyword: string,
    stream: stream.Transform,
    searchIds: number[]
  ) {
    const matcher = new RegExp(keyword, 'i')
    await bluebird.each(searchIds, async id => {
      const res = await fetch(`${apis.items.url}${apis.items.resource(id)}`)
      const item = await res.json()
      if (item.longDescription.match(matcher)) stream.write(item.itemId)
      await bluebird.delay(500) // rate-limit friendly
    })
    stream.end()
  }

  return async function get (ctx: Koa.Context): Promise<any> {
    const keyword = ctx.query.keyword
    if (!keyword) throw new errors.Api400('search keyword missing')
    ctx.type = 'json'
    const stream = JSONStream()
    ctx.body = stream
    stream.on('error', ctx.onerror)
    return ctx.query.live
      ? searchLive(keyword, stream, apis.items.permittedIds)
      : searchCached(keyword, stream)
  }
}
