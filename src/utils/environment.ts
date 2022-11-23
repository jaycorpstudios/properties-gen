import path from 'path'
import deepMerge, { AnyObject } from './deepMerge'
import { loadJsonFile } from './fileSystem'
import { isPrimitive, isArray } from './common'

export const getEnvironmentTarget = (
  envTargetKey: string,
  defaultEnvTargetValue: string
): string => {
  const value = process.env[envTargetKey]
  if (!value) {
    console.warn(
      `No value set for ${envTargetKey}, using default value: ${defaultEnvTargetValue}`
    )
  }
  return value || defaultEnvTargetValue
}

const parseEnvValue = (value) => {
  const regex = new RegExp(/{{(.*)}}/)
  const shouldParse = typeof value === 'string' && regex.test(value)
  const [pattern = '', patternKey] = regex.exec(value) || []
  const patternValue = process.env[patternKey] || ''
  return shouldParse ? value.replace(pattern, patternValue) : value
}

const injectEnvValues = (data: AnyObject) => {
  if (isPrimitive(data)) {
    return parseEnvValue(data)
  }
  if (isArray(data)) {
    return data.map((value) => injectEnvValues(value))
  }
  const keys = Object.keys(data)
  for (const key of keys) {
    const isObject = data[key] instanceof Object
    data[key] = isObject ? injectEnvValues(data[key]) : parseEnvValue(data[key])
  }
  return data
}

export const getEnvironmentGroup = async (
  inputFolder: string,
  extendsFromBase: boolean,
  targetEnvironment: string
): Promise<AnyObject> => {
  const env = await loadJsonFile<AnyObject>(
    path.resolve(inputFolder, `env.${targetEnvironment}.json`)
  )
  const base = extendsFromBase
    ? await loadJsonFile<AnyObject>(path.resolve(inputFolder, `base.json`))
    : {}

  const mergedData = deepMerge(base, env)
  return injectEnvValues(mergedData)
}
