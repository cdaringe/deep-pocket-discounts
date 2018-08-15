# contributing

## pre-reqs

install:

- nodejs 10.+
- docker, 18.*
- yarn, latest

## getting started

this project houses multiple artifacts.  see the `packages/` folder for individual project sources.

this project uses [lerna](https://www.npmjs.com/package/lerna) to link the dependent projects together, so concurrent development may occur.

### installation

- cd `/path/to/deep-pocket-discounts`
- `yarn bootstrap` to install all dependencies & link any child project dependencies
  - **never `yarn add <thing>`** into a project directly, unless you know what you are doing.  it's advisable to add dependencies to the relevant package.json and run `yarn bootstrap` again from the root project.  this ensures that all links remain intact between packages!
- `yarn build` to compile all sub projects.

### configuration

- in `packages/api`, there is a `.env.example` file.  you will want to create a `.env.<development|production>` file contingent on the environment you target.

## run

- `yarn start` to start the ui & api

edit freely.

alterantively, run `yarn start` in each desired project.  see each package for individual package instructions.

## develop

### general

- VSCode users can benefit from the multi-package project by opening `deep-pocket-discounts.code-workspace`
  - e.g. `code deep-pocket-discounts.code-workspace`
  - this enables all of the [VSCode workspace radness](https://code.visualstudio.com/docs/editor/multi-root-workspaces)

## test

see individual packages, specifically for `package.json :: scripts.test`


## lint

- standard

all code is autoformatted using `prettier-standard` for an opinionated, rigid style
