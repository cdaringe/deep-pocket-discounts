# api

## build

- `yarn build`

## usage

- `yarn start`, or `node build/bin.js`


## configuation

- set `NODE_ENV=production|development`
  - **`NODE_ENV` must be set** or the API will not run
  - see `.env.example` for configuration values and descriptions

| ENV variable        | default value              | description                                          |
| ------------------- | -------------------------- | ---------------------------------------------------- |
| `DATA_DIRNAME`      | `~/.deep-pockets`          | Local data storage dirname                           |
| `DB_FILENAME`       | `~/<DATA_DIRNAME>/db.json` | Database file to cache replicated items              |
| `FORCE_REPLICATION` | `false`                    | Replicates the remote DB locally for faster searches |
| `ITEM_API_KEY`      | -                          | Required. Key for HTTP access to /items API          |
| `PRODUCT_API_URL`   | -                          | Required.  e.g. `https://product.api/v2`             |
| `REPLICATE_IDS`     | -                          | Required.  e.g. `1,2,3`                              |

<small>psst, ^VSCode [text-tables](https://github.com/rpeshkov/vscode-text-tables) extension is awesome!</small>
