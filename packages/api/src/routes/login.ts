import { isDev } from 'common'
import * as createDebug from 'debug'
import * as errors from '../errors'
import * as Koa from 'koa'

export function post (app: Koa) {
  const debug = createDebug('dpd:route:login:post')
  debug('registering post route')
  return async function post (ctx: Koa.Context): Promise<any> {
    // @TODO update login route to use real user
    if (isDev) {
      return {
        jwt: 'fake-jwt',
        user: {
          id: 1,
          username: 'admin',
          account: {
            id: 1
          }
        }
      }
    }
    throw new errors.Api501()
  }
}
