import { escapeRegExp } from 'lodash'
import { Pocket } from '..'
import * as bluebird from 'bluebird'
import * as createDebug from 'debug'
import * as errors from '../errors'
import * as JSONStream from 'streaming-json-stringify'
import * as Koa from 'koa'
import * as stream from 'stream'
import fetch from 'node-fetch'

interface ISearchInput {
  matcher: RegExp
  returnFullDocs: boolean
  searchIds?: number[]
  stream: stream.Transform
}

/**
 * /api/search - search through the walmart item api, looking for keyword matches
 *
 * in a larger environment, we would design in pagination features,
 * using an offset, page size, sorting, etc.
 */
export function get (db: Pocket.IDb, apis: Pocket.IApisConfig) {
  const debug = createDebug('dpd:route:search:get')
  debug('registering route')

  async function searchCached (opts: ISearchInput) {
    const { returnFullDocs, matcher, stream } = opts
    // this file based db implementation has no cursors, otherwise we'd:
    //  - stream thru our records, applying our filter, & pipe to the client, or, more likely
    //  - offload the query to the db engine, & stream/pipe the results to the client
    const catalog = await db.readAsync()
    Object.values(catalog)
      .filter((item: any) => item.longDescription.match(matcher))
      .forEach((item: any) => stream.write(returnFullDocs ? item : item.itemId))
    stream.end()
  }

  async function searchLive (opts: ISearchInput) {
    const { returnFullDocs, matcher, stream } = opts
    await bluebird.each(apis.items.permittedIds, async id => {
      const res = await fetch(`${apis.items.url}${apis.items.resource(id)}`)
      const item = await res.json()
      if (item.longDescription.match(matcher)) {
        stream.write(returnFullDocs ? item : item.itemId)
      }
      await bluebird.delay(500) // rate-limit, be friendly to the API
    })
    stream.end()
  }

  return async function get (ctx: Koa.Context): Promise<any> {
    const keyword = ctx.query.keyword
    if (!keyword) throw new errors.Api400('search keyword missing')
    const matcher = new RegExp(escapeRegExp(keyword), 'i')
    const returnFullDocs = !!ctx.query.doc
    const stream = JSONStream()
    ctx.type = 'json'
    ctx.body = stream
    stream.on('error', ctx.onerror)
    ctx.log.debug(`keyword: ${keyword}, liveMode: ${!!ctx.query.live}`)
    return ctx.query.live
      ? searchLive({ returnFullDocs, matcher, stream })
      : searchCached({ returnFullDocs, matcher, stream })
  }
}
