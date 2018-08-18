import * as Koa from 'koa'
import { ApiError } from '../errors'

export async function middleware (ctx: Koa.BaseContext, next: any) {
  var res
  try {
    res = await next()
    ctx.body = ctx.body || res
    ctx.status = ctx.status || 200
    return
  } catch (err) {
    if (err instanceof ApiError) {
      let apiErr = err as ApiError
      ctx.body = {
        error:
          apiErr.message ||
          (apiErr.constructor as typeof ApiError).defaultMessage
      }
      ctx.status =
        (apiErr as any).status || (apiErr.constructor as typeof ApiError).status
    } else {
      ctx.body = { error: 'Fatal error' }
      ctx.status = err.status || 500
      ctx.services.logger.error(err)
    }
  }
}
