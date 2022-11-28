# properties-gen

CLI that generates properties files for a given environment

## Features

- extends from base file
- parse env variables

## Installation

```bash
# Locally in your project.
npm install -D properties-gen
# with yarn
yarn i properties-gen --save-dev

# Or globally
npm install -g properties-gen
```

## Usage

### Create initial configuration file

```bash
npx properties-gen init
```

This will create a `properties.config.json` file in your root directory, notice you can define as many properties files as you need (groups in the `configurationGroups` array), usually we just need client, server or both.

```json
{
  "configurationGroups": [
    {
      "inputFolder": "config/server/",
      "outputFile": "environment/env.server.js",
      "extendsFromBase": true
    },
    {
      "inputFolder": "config/client/",
      "outputFile": "environment/env.client.js",
      "extendsFromBase": true
    }
  ],
  "envTargetKey": "NODE_ENV",
  "defaultEnvTargetValue": "dev"
}
```

### Define your configuration files

For each configuration group, create the folder that contains the `base.json` (if `extendsFromBase` is true) and as many `env.{ENV}.json` files as you need, for example:

`config/server/base.json`

```json
{
  "isProduction": false,
  "someKey": "someValue",
  "msHost": "http://localhost:3010/",
  "db": {
    "someSecret": "{{SECRET}}"
  }
}
```

Overrite and extend values for the rest of environments.

`config/server/env.dev.json`

```json
{
  "msHost": "http://api.dev.myapp.com"
}
```

`config/server/env.prod.json`

```json
{
  "isProduction": true,
  "msHost": "https://api.myapp.com/"
}
```

### Generate environment files

```bash
npx properties-gen generate
```

This command will take the current environment to generate the properties file in the location defined on `outputFile`. Notice `NODE_ENV` is the default key for the environments but you can override this value by setting a different one in `envTargetKey` like `COUNTRY` or `TENANT`.

Example:

```bash
NODE_ENV=production SECRET=mySecret npx properties-gen generate
```

output: `environment/env.server.js`

```js
module.exports = {
  isProduction: true,
  someKey: 'someValue',
  msHost: 'https://api.myapp.com/',
  db: {
    someSecret: 'mySecret',
  },
}
```

_Tip:_ use `npx properties-gen init` to create the configuration file, then install properties-gen as a development dependency in your project and finally chain the `properties-gen generate` command before the `start`|`dev`|`build` command, so properties are generated before running the project.


Package script defintion example using NextJs
`package.json`
```json
{
  "name": "myApp",
  "scripts": {
    "gen-config": "properties-gen generate",
    "dev": "npm run gen-config && next dev",
    "build": "npm run gen-config && next build",
    "start": "next start",
  }
}

```