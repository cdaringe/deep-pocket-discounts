import 'perish'
import { resolve } from 'path'
import { Service } from './index'
import * as fs from 'fs-extra'
const debug = require('debug')('dpd:api:bin')
const dotenv = require('dotenv')

async function start () {
  const envConfigFilename = resolve(
    __dirname,
    `../.env.${process.env.NODE_ENV}`
  )
  let stat
  try {
    stat = await fs.lstat(envConfigFilename)
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
  var service = new Service()
  await service.start({})
}
start()
