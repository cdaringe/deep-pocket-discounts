# design discussion

- author: [cdaringe](https://cdaringe.com/)
- date: August 2018

## requirements

- a product keyword search functionality shall be implemented via a REST-like API
- the API shall take as input one keyword and as output provide a [list, of, product, ids]
- the API shall operate over an external product `/items` API
- the API shall only use a set fixed product IDs (whitelist) to include in search result sets

## abstract

my demo consists for four projects:

- the `<root>` project, where this document lives. this project is primarily used for orchestration and development setup
- `./packages/api` - the primary delivery of the demo.  the api alone fulfills the aforementioned requirements.
- `./packages/ui` - a react app to visualize the work done in the api
- `./packages/common` - a tiny library that shares various shared code between the api & ui

most of the projects are written in `typescript`, which is somewhat new to me.  i
chose to use typescript for the sake of learning and assessing the language further.
a variety of test and support scripts also use vanillajs (node, browser), and various
shell utilities.  i do not guarantee support on windows.

## projects

### <root> project

the `<root>` project is responsible for:

- setting up child projects
- orchestrating builds
- configuring CI

i chose to use [lerna](https://github.com/lerna/lerna) for this project.  because i knew that i would likely
support the api with a ui, i assumed at least some common code would exist between them.  lerna enables the ability to
develop multiple co-dependent projects concurrently.  i ended up not utilizing an extensive amount of shared code in
this project, but it also has the added benefit of giving a clean monorepo structure with various, handy, package-wise
sugar commands, e.g. `lerna exec <cmd-for-sub-package>`.

#### garbage in, garbage out

root project is structured with some example efforts to keep all inputs clean, such that
chances of acceptance via pull-requests stay favorably high.  here are some mechanisms deployed:


on a developer's machine:

- `lint-staged` - auto-formats all code on commit
- `lint` - enforces code style on comm\it
- `commitlint` - scrubs commits into standard format. for example:

```
husky > npm run -s commitmsg (node v10.8.0)

⧗   input: chore(project): skip internals in api launch
✔   found 0 problems, 0 warnings
```

...which also runs against GitHub PRs!

in ci:

- `lint` - re-asserts code style is valid
- `test` - run all test suites and communicates back to VCS (i.e. GitHub) the state of the build

there are more mechanisms that can be deployed here as well.  for instance, i am
a big proponent of [semantic-release](https://github.com/semantic-release/semantic-release)
for having fully commit-based, semver enforced, automated releases.  the above i
believe to be sufficient for demonstration purposes.

### api

the api is the only component required for completion of the objective.  see `/packages/api`.

#### overview

for my api implementation, i chose to use the popular [koa](https://koajs.com/) framework.  whilst i
enjoy using `hapi`, i have found favor in recent projects using `koa`.
unlike `hapi`'s plugin system, `koa` brings functionality
primarily via stack-style middleware for the request-response lifecycle, and
carries other stateful datas and utilities on a request-response context object.

**not all files, functions, or middleware committed are essential to meeting the
objective of the project**.  however, many are positioned intentionally such
that one can understand my thought process and/or problem solving strategies.

a variety of `koa` middlewares are deployed to offer a good user and developer API
experience.

in `api/src/middleware`, one can observe:

- a body parser (HTTP body => JS primitive converter)
- a response compressor (keep that network traffic light!)
- a module that applies various security best practices (`helmet`), primary via HTTP headers
- a request logger
- a response time recorder (great for dev mode on slow HTTP calls)
- ...and others

these aren't all needed for the demo, but exhibit thought over the many considerations
one may apply during the design of an api.

in `api/src/services`, one can observe a `db` and `replicator` service.  these
are stateful services that support the search api.  because _how_ search is to
performed is not strictly defined, i provide _two_ implementations:

- **live**: where search queries happen against the supporting API real-time, and
- **cached**: where search queries happen against cached copies of the items

supporting cached mode was a simply a fun exercise to demonstrate a (non-ideal) mechanism
as to how one may serve queries faster.

in docker and/or production mode, you will also notice that all logs are in JSON.
this is intenional--this structured logging format enables us or our orchestrator
to pass logs of to a logging aggregator such that logs can more easily be searched
in the context of a larger system.

to run the api, please see its [associated readme](./packages/api/readme.md)

### ui

the ui is a `create-react-app`/`react-scripts` application using the `typescript` react-scripts derivative.

#### overview

the ui is a small and simple design.

- state management is controlled via react's built in state interface
- search functionality is primarily driven thru `rxjs`
    - _aside_: i nearly wrote this application in [elm-lang](http://elm-lang.org/). i am much faster and more proficient in react, but have been trying to get back to more pure implementations of functional programming.  hooray for no runtime errors! _end aside_
    - imperative `fetch`/`xhr` can work great here too, but [rx](http://reactivex.io/)-based approaches _can offer_ various perks in many situations that imperative or OOP style data-flows are sloppy at (side-effect cancellation, throttle/debounce, etc).
- `semantic-ui-react` and some loosely BEM typed classes yield the primary aesthetics


