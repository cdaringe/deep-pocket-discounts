import ava, { TestInterface } from 'ava'
import { setup, teardown, StackContext } from './fixture/stack'
import * as request from 'supertest'
import { Response } from 'superagent'

const fuzzer = require('fuzzer')
fuzzer.seed(1e6)

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

test('/api/search - missing keyword', async t => {
  try {
    await request(t.context.apiService.server)
      .get('/api/search')
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res: Response) => {
        t.truthy(res.text.match(/keyword missing/i))
      })
  } catch (err) {
    t.fail(err)
  }
})

test('/api/search - cached - keyword: backpack', async t => {
  const expectedIds = [35613901, 35813552, 23117408]
  try {
    await request(t.context.apiService.server)
      .get('/api/search?keyword=backpack')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res: Response) => {
        ;[res.body, expectedIds].forEach(arr =>
          arr.sort((a: number, b: number) => a > b)
        )
        t.deepEqual(res.body, expectedIds, 'query ids match')
      })
  } catch (err) {
    t.fail(err)
  }
})

test('/api/search - live - keyword: backpack', async t => {
  const expectedIds = [35613901, 35813552, 23117408]
  try {
    await request(t.context.apiService.server)
      .get('/api/search?keyword=backpack&live=true')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res: Response) => {
        ;[res.body, expectedIds].forEach(arr =>
          arr.sort((a: number, b: number) => a > b)
        )
        t.deepEqual(res.body, expectedIds, 'query ids match')
      })
  } catch (err) {
    t.fail(err)
  }
})

test('/api/search - special chars, needing escape', async t => {
  try {
    await request(t.context.apiService.server)
      .get('/api/search?keyword=Multi-Floor)') // mattress item match
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res: Response) => {
        t.is(res.body && res.body[0], 39082884, 'search finds parenthesis')
      })
  } catch (err) {
    t.fail(err)
  }
})

test('/fuzzed/routes', async t => {
  let i = 500
  let route = '/api/fuzz/me'
  while (i) {
    route = fuzzer.mutate.string(route)
    if (route[0] !== '/') route = `/${route}`
    for (let method of ['get', 'post']) {
      await request(t.context.apiService.server)
        [method](route)
        .expect((res: Response) => {
          t.truthy(res.status < 500, 'fuzzed routes all 1xx/2xx/3xx/4xx')
        })
    }
    --i
  }
  t.pass('all fuzzed inputs passed')
})

test('/api/search - fuzzed search', async t => {
  let i = 500
  let searchTerm = 'fuzz_me_search_term'
  while (i) {
    searchTerm = fuzzer.mutate.string(searchTerm)
    await request(t.context.apiService.server)
      .get(`/api/search?keyword=${searchTerm}`) // mattress item match
      .expect(200)
    --i
  }
  t.pass('all fuzzed inputs passed')
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
