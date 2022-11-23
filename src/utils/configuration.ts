import fs from 'fs/promises'
import {
  configFileName,
  defaultClientGroup,
  defaultConfig,
  defaultServerGroup,
} from '../constants/configSchema'
import { InitialGroupOptions } from '../enums/index'

export const initialConfigurationGroups = {
  server: [defaultServerGroup],
  client: [defaultClientGroup],
  both: [defaultServerGroup, defaultClientGroup],
}

export const getInitialConfig = async (initialGroups: InitialGroupOptions) => {
  return {
    ...defaultConfig,
    configurationGroups:
      initialConfigurationGroups[initialGroups as InitialGroupOptions],
  }
}

export const isConfigFilePresent = async () => {
  try {
    await fs.access(configFileName)
    return true
  } catch {
    return false
  }
}
