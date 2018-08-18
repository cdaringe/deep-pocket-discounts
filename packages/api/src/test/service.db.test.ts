import { promisify } from 'util'
import { setup, teardown, StackContext } from './fixture/stack'
import * as fs from 'fs-extra'
import * as tmp from 'tmp'
import ava, { TestInterface } from 'ava'

const test = ava as TestInterface<StackContext>

test.beforeEach(async t => {
  const filename = await promisify(tmp.tmpName.bind(tmp))()
  const serviceOptions = { services: { db: { filename } } }
  await setup(t.context, serviceOptions as any)
})
test.afterEach(t => teardown(t.context))

test('crud', async t => {
  const db = t.context.apiService.services.db!
  const testKv = { key: 'test_key', value: 'test_value' }
  await db.writeAsync(testKv.key, testKv.value)
  try {
    const stat = await fs.lstat(db.filename)
    t.truthy(stat.isFile(), 'valid db file stat')
  } catch (err) {
    t.fail(err)
  }
  const readValue = await db.readAsync(testKv.key)
  t.is(readValue, testKv.value, 'write/read identity test')
})
