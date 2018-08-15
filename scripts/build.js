#! /usr/bin/env node
require('perish')
const { partition } = require('lodash')
const { resolve } = require('path')
const chalk = require('chalk')
const execa = require('execa')
const fs = require('fs-extra')
const globCb = require('glob')
const util = require('util')
const meow = require('meow')
const glob = util.promisify(globCb)

const LOG_PREFIX = chalk.blue.bold('deep-pocket-discounts :: ')
const ROOT_DIRNAME = resolve(__dirname, '..')
const PKGS_DIRNAME = resolve(ROOT_DIRNAME, 'packages')

const log = (...args) => console.log(LOG_PREFIX, ...args)
const readJson = filename => fs.readFile(filename).then(JSON.parse)
const zip = (a, b) => a.map((ai, n) => [ai, b[n]])

/**
 * build all projects.
 *
 * compile precedence graph:
 * common
 * |   \
 * api  ui
 */
async function compileAll () {
  const projectRootDirnames = await glob(`${PKGS_DIRNAME}/*`)
  const pkgs = await Promise.all(
    projectRootDirnames.map(root => readJson(resolve(root, 'package.json')))
  )
  // put pkgs in build order
  // [[arr, of, 1st to, build], [arr, of 2nd to build], ... [arr of nth, to build]]
  let packageNames = zip(projectRootDirnames, pkgs)
  let [common, rest] = partition(packageNames, ([d, pkg]) =>
    pkg.name.match(/common/i)
  )
  const toBuild = [common].concat([rest])
  log(`${toBuild.length} parallel build phases detected`)
  while (toBuild.length) {
    const wip = toBuild.shift()
    log(`building projects: ${wip.map(([d, pkg]) => pkg.name).join(', ')}`)
    await Promise.all(
      wip
        .filter(([dirname, pkg]) => pkg.scripts && pkg.scripts.build) // only build those w/ build scripts
        .map(([dirname, pkg]) =>
          execa('yarn', ['build'], { cwd: dirname, stdio: 'inherit' })
        )
    )
  }
}

const cli = meow(
  `
Usage
  $ node scripts/build <input>

Options

Examples
  $ build compile:all # compile all subprojects, max parallelization!
`,
  {
    flags: {}
  }
)
async function go () {
  const cmd = cli.input[0]
  if (cmd === 'compile:all') compileAll()
  else {
    console.error(`unsupported cmd: ${cmd}`)
    process.exit(1)
  }
}
go()
