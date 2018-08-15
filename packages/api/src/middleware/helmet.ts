import * as helmet from 'koa-helmet'

export function middleware () {
  const mw = helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"]
      }
    },
    referrerPolicy: { policy: 'no-referrer' }
  })
  return mw
}
