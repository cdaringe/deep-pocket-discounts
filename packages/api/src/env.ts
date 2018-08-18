// @warning
// this file _must_ be fully syncronous such that the test runner can execute
// it to completion before executing dependent tests. :(

import { resolve } from 'path'
import * as fs from 'fs-extra'

const debug = require('debug')('dpd:api:env')
const dotenv = require('dotenv')

const envConfigFilename = resolve(__dirname, `../.env.${process.env.NODE_ENV}`)
let stat
try {
  stat = fs.lstatSync(envConfigFilename)
} catch (err) {
  if (err.code !== 'ENOENT') throw err
}
if (stat) {
  dotenv.config({ path: envConfigFilename })
  debug(`loaded env file from ${envConfigFilename}`)
}
if (!process.env.NODE_ENV) {
  console.error(
    [
      'please set a NODE_ENV environment variable. ',
      'for example, add \n\n\texport NODE_ENV=development\n\n',
      'into your .bashrc or simply run NODE_ENV=development <file.js>'
    ].join('')
  )
  process.exit(1)
}
