export const configFileName = 'env-properties.config.json'

export interface DefaultConfigSchema {
  configurationGroups: ConfigurationGroupInterface[]
  envTargetKey?: string
  defaultEnvTargetValue?: string
}

export const defaultConfig: DefaultConfigSchema = {
  configurationGroups: [],
  envTargetKey: 'NODE_ENV',
  defaultEnvTargetValue: 'development',
}

export interface ConfigurationGroupInterface {
  inputFolder: string
  outputFile: string
  extendsFromBase: boolean
}

export const defaultServerGroup: ConfigurationGroupInterface = {
  inputFolder: 'config/server/',
  outputFile: 'environment/env.server.js',
  extendsFromBase: true,
}

export const defaultClientGroup: ConfigurationGroupInterface = {
  inputFolder: 'config/client/',
  outputFile: 'environment/env.client.js',
  extendsFromBase: true,
}
