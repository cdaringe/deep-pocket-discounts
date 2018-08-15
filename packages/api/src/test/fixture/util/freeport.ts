import { promisify } from 'util'
import * as freeportCb from 'freeport'
export const freeport = promisify(freeportCb)
