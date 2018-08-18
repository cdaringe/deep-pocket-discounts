import { escapeRegExp } from 'lodash'
import { Pocket } from '..'
import * as bluebird from 'bluebird'
import * as createDebug from 'debug'
import * as errors from '../errors'
import * as JSONStream from 'streaming-json-stringify'
import * as Koa from 'koa'
import * as stream from 'stream'
import fetch from 'node-fetch'

/**
 * /api/search - search through the walmart item api, looking for keyword matches
 *
 * in a larger environment, we would design in pagination features,
 * using an offset, page size, sorting, etc.
 */
export function get (app: Koa, db: Pocket.IDb, apis: Pocket.IApisConfig) {
  const debug = createDebug('dpd:route:search:get')
  debug('registering route')

  async function searchCached (matcher: RegExp, stream: stream.Transform) {
    // this file based db implementation has no cursors, otherwise we'd:
    //  - stream thru our records, applying our filter, & pipe to the client, or, more likely
    //  - offload the query to the db engine, & stream/pipe the results to the client
    const catalog = await db.readAsync()
    Object.values(catalog)
      .filter((item: any) => item.longDescription.match(matcher))
      .forEach((item: any) => stream.write(item.itemId))
    stream.end()
  }

  async function searchLive (
    matcher: RegExp,
    stream: stream.Transform,
    searchIds: number[]
  ) {
    await bluebird.each(searchIds, async id => {
      const res = await fetch(`${apis.items.url}${apis.items.resource(id)}`)
      const item = await res.json()
      if (item.longDescription.match(matcher)) {
        stream.write(item.itemId)
      }
      await bluebird.delay(500) // rate-limit friendly
    })
    stream.end()
  }

  return async function get (ctx: Koa.Context): Promise<any> {
    const keyword = ctx.query.keyword
    if (!keyword) throw new errors.Api400('search keyword missing')
    const matcher = new RegExp(escapeRegExp(keyword), 'i')
    const stream = JSONStream()
    ctx.type = 'json'
    ctx.body = stream
    stream.on('error', ctx.onerror)
    return ctx.query.live
      ? searchLive(matcher, stream, apis.items.permittedIds)
      : searchCached(matcher, stream)
  }
}
