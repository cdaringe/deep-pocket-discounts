import { Pocket } from '../..'
import * as api from './api'

export type StackContext = api.ApiContext // & DbContext, iff implemented

export async function setup (
  ctx: Partial<StackContext>,
  opts?: Partial<Pocket.IServiceConfig>
) {
  await api.setup(ctx, opts)
}

export async function teardown (ctx: StackContext) {
  await api.teardown(ctx)
}
