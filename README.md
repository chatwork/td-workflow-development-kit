# td-workflow-development-kit

[![CircleCI](https://circleci.com/gh/chatwork/td-workflow-development-kit.svg?style=svg)](https://circleci.com/gh/chatwork/td-workflow-development-kit)

## Installation and Usage

Install td-workflow-development-kit using `npm`:

``` bash
npm install -g chatwork/td-workflow-development-kit
```

Or `yarn`:

``` bash
yarn global add chatwork/td-workflow-development-kit
```

See help message for details.

``` bash
td-wdk
```

You need to authorize the account, before executing any other commands.

``` bash
td-wdk set-api <Your API Key>
```

### Create Workspace

Create a working directory for Workflow in `./td-wdk`.

``` bash
td-wdk create
```

### Configuration

Write parameters in `./td-wdk/config.yaml`.

The environment switching is defined in the environment variable `TD_WDK_ENV`.

If no environment variables are defined, `dev` is used.

for `dev`:

``` bash
export TD_WDK_ENV=dev
```

for `prd`:

``` bash
export TD_WDK_ENV=prd
```

### Build Workflow

Workflow written in `./td-wdk/src` is built and generated in`./td-wdk/dist`.

``` bash
td-wdk build
```

### Deploy Workflow

Deploy the built Workflow to TD.

``` bash
td-wdk deploy
```

## How to write Workflow

Write like the following example,

``` yaml:source.dig
_export:
  td:
    database: '###td.database###'
    table: '###td.table###'

+task:
  td>: 'SELECT * FROM ${td.table}'
```

and

``` yaml:config.yaml
env:
  prd:
    projectName: sample-project
    param:
      td:
        database: sample-db
        table: sample-table
  dev:
    projectName: sample-project-dev
    param:
      td:
        database: test-db
        table: test-table

```

When building in the `dev` environment ...

``` yaml:distribution.dig
_export:
  td:
    database: 'test-db'
    table: 'test-table'

+task:
  td>: 'SELECT * FROM ${td.table}'
```
