import * as api from './api'

export type StackContext = api.ApiContext // & DbContext, iff implemented

export async function setup (ctx: Partial<StackContext>) {
  await api.setup(ctx)
}

export async function teardown (ctx: StackContext) {
  await api.teardown(ctx)
}
