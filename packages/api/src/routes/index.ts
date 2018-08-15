import { Pocket } from '../interfaces'
import * as Koa from 'koa'
import * as login from './login'
import * as Router from 'koa-router'

export async function bind (
  app: Koa,
  router: Router,
  services: Pocket.IServices
) {
  router.get('/hello', (ctx: Koa.Context) => 'world!')
  router.post('/login', login.post(app))
  app.use(router.routes()).use(router.allowedMethods())
}
