# properties-gen

CLI that generates properties files for a given environment.

## Motivation

You need to build your application for different targets, so you have a base configuration file with default values and want to override specific ones for the rest of the targets.

This way you dont need to define every dynamic value by using environment variables.

## Features

- extends from base file
- parse env variables
- output configuatio as JSON or JS files

## Installation

Locally in your project.

```bash
$ npm install -D properties-gen
```

or globally

```
$ npm install -g properties-gen
```

Install with yarn

```bash
$ yarn i properties-gen --save-dev
```

## command line options

```bash
Usage: properties-gen [options] [command]

Options:
  -h, --help          display help for command

Commands:
  init                Generates default config file
  generate [options]  Generates environment properties files
  help [command]      display help for command
```

Options for `generate` command:
```bash
Usage: properties-gen generate [options]

Generates environment properties files

Options:
  -f, --file [pathToFile]  Specify configuration file
  -h, --help               display help for command
```

# Usage

## Configuration

Generate the initial configuration file

```bash
$ npx properties-gen init
```

This will create a `properties.config.json` file in your root directory, notice you can define as many properties files as you need (groups in the `configurationGroups` array), usually we just need client, server or both.

```json
{
  "configurationGroups": [
    {
      "inputFolder": "config/server/",
      "inputFileNamePattern": "env.{{envTargetKey}}.json",
      "outputFile": "environment/env.server.js",
      "extendsFromBase": true,
      "fileBaseName": "base.json"
    },
    {
      "inputFolder": "config/client/",
      "inputFileNamePattern": "env.{{envTargetKey}}.json",
      "outputFile": "environment/env.client.js",
      "extendsFromBase": true,
      "fileBaseName": "base.json"
    }
  ],
  "envTargetKey": "NODE_ENV",
  "defaultEnvTargetValue": "dev"
}
```

| name | type | description |
|---|---|---|
| envTargetKey | `{String}` | default:  `NODE_ENV` Environment variable key which dictates the environment file to process. (e.g.) `COUNTRY`, `TENANT` |
| defaultEnvTargetValue | `{String}` | default: `dev` Fallback value for envTargetKey key. (e.g. `NODE_ENV=dev`) |
| configurationGroups | `Array of {configurationGroup}` |  |
| configurationGroup.inputFolder | `{String}` | default: `config/server/` Folder where configuration files are located |
| configurationGroup.inputFileNamePattern | `{String}` | default: `env.{{envTargetKey}}.json` The name pattern for the input files, notice you must include `{{envTargetKey}}` in order to dynamically pick the right one when running the generate command. |
| configurationGroup.outputFile | `{String}` | default: `environment/env.groupName.js` The output filename, only `.json` or `.js` extensions are valid. |
| configurationGroup.extendsFromBase | `{Boolean}` | default: `true` When active will look for a `base.json` file in the `configurationGroup.inputFolder` location in order to extend the configuration values. |
| configurationGroup.fileBaseName | `{String}` | default: `base.json` The base configuration file name to pick when `configurationGroup.extendsFromBase` is `true`, only `.json` or `.js` extensions are valid. |

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
NODE_ENV=prod SECRET=mySecret npx properties-gen generate
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

_Tip:_ you may want to add the output file to `.gitignore` as is not meant to be tracked

Package script example using NextJs

`package.json`

```json
{
  "name": "myApp",
  "scripts": {
    "config": "properties-gen generate",
    "dev": "npm run config && next dev",
    "build": "npm run config && next build",
    "start": "next start"
  }
}
```
