import * as random from './random'
import * as rest from './rest'
export { random, rest }

export const msg = {}

export const isDev = !!(process.env.NODE_ENV || '').match(/dev|test/i)
export const isPrd = !isDev
export const constants = {
  APP_NAME: 'Deep Pocket Discounts™'
}
