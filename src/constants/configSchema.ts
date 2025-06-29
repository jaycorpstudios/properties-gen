export const configFileName = 'properties.config.json'

export interface DefaultConfigSchema {
  configurationGroups: ConfigurationGroupInterface[]
  envTargetKey?: string
  defaultEnvTargetValue?: string
  useEsModule?: boolean
}

export const defaultConfig: DefaultConfigSchema = {
  configurationGroups: [],
  envTargetKey: 'NODE_ENV',
  defaultEnvTargetValue: 'dev',
  useEsModule: false,
}

export interface ConfigurationGroupInterface {
  inputFolder: string
  inputFileNamePattern?: string
  fileBaseName?: string
  outputFile: string
  extendsFromBase: boolean
}

export const fileBaseNameDefault = 'base.json'
export const inputFileNamePatternDefault = 'env.{{envTargetKey}}.json'

export const defaultServerGroup: ConfigurationGroupInterface = {
  inputFolder: 'config/server/',
  outputFile: 'environment/env.server.js',
  extendsFromBase: true,
  inputFileNamePattern: inputFileNamePatternDefault,
  fileBaseName: fileBaseNameDefault,
}

export const defaultClientGroup: ConfigurationGroupInterface = {
  inputFolder: 'config/client/',
  outputFile: 'environment/env.client.js',
  extendsFromBase: true,
  inputFileNamePattern: inputFileNamePatternDefault,
  fileBaseName: fileBaseNameDefault,
}
