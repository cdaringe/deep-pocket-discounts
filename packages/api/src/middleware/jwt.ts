import * as Koa from 'koa'
import { Api401 } from '../errors'

/**
 * provide a short-hand jwt lookup for the context.
 * downstream middlewares may extract an expected JWT
 * from cookies or headers by a single field access
 */
export async function middleware (ctx: Koa.Context, next: any) {
  Object.defineProperty(ctx.state, 'jwt', {
    get () {
      let jwt = ctx.cookies.get('jwt')
      if (!jwt) {
        try {
          jwt = ctx.request.headers.authorization.match(/Bearer (.*)/)[1]
        } catch (err) {
          throw new Api401('missing jwt')
        }
      }
      return jwt
    }
  })
  await next()
}
