import * as helmet from 'koa-helmet'

export function middleware () {
  const mw = helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
          '*.gstatic.com',
          '*.googleapis.com',
          '*.walmartimages.com'
        ]
      }
    },
    referrerPolicy: { policy: 'no-referrer' }
  })
  return mw
}
