import ava, { TestInterface } from 'ava'
import { setup, teardown, StackContext } from './fixture/stack'
import * as request from 'supertest'
import { Response } from 'superagent'

const test = ava as TestInterface<StackContext>

test.beforeEach(t => setup(t.context))
test.afterEach(t => teardown(t.context))

test('/api/hello', async t => {
  try {
    await request(t.context.apiService.server)
      .get('/api/hello')
      .expect(200)
      .expect('Content-Type', /plain/)
      .expect((res: Response) => {
        t.truthy(res.text.match(/world/i))
      })
  } catch (err) {
    t.fail(err)
  }
})

test('/, /client/side/route', async t => {
  const staticRoutes = [
    '/',
    '/client/side/route',
    '/index.html',
    '/static/missing.css'
  ]
  try {
    for (const route of staticRoutes) {
      await request(t.context.apiService.server)
        .get(route)
        .expect(200)
        .expect('Content-Type', /html/)
        .expect((res: Response) => {
          t.truthy(res.text.match(/<!doctype html>/i))
        })
    }
  } catch (err) {
    t.fail(err)
  }
})
