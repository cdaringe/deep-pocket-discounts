import { Pocket } from '../interfaces'
import * as Koa from 'koa'
import * as login from './login'
import * as Router from 'koa-router'
import * as search from './search'

export async function bind (
  app: Koa,
  config: Pocket.IServiceConfig,
  router: Router,
  services: Pocket.IServices
) {
  router.get('/hello', () => 'world!')
  router.post('/login', login.post(app))
  router.get('/search', search.get(services.db!, config.apis))
  app.use(router.routes()).use(router.allowedMethods())
}
