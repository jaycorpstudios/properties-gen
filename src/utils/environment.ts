import path from 'path'
import deepMerge, { AnyObject } from './deepMerge'
import { loadFile, loadJsonFile } from './fileSystem'
import { isPrimitive, isArray } from './common'
import { SupportedFileExtensions } from '../enums'

export const getEnvironmentTargetKey = (
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

export const parseEnvValue = (key, value: string | undefined = undefined) => {
  const regex = new RegExp(/{{(.*)}}/)
  const shouldParse = typeof key === 'string' && regex.test(key)
  const [pattern = '', patternKey] = regex.exec(key) || []
  const patternValue = value || process.env[patternKey] || ''
  return shouldParse ? key.replace(pattern, patternValue) : key
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

interface getEnvironmentGroupParams {
  inputFolder: string
  extendsFromBase: boolean
  targetEnvironmentKey: string
  inputFileNamePattern: string
  fileBaseName: string
}

export const getEnvironmentGroup = async ({
  inputFolder,
  extendsFromBase,
  targetEnvironmentKey,
  inputFileNamePattern,
  fileBaseName,
}: getEnvironmentGroupParams): Promise<AnyObject> => {
  const inputFileExtension = inputFileNamePattern
    .split('.')
    .pop() as SupportedFileExtensions
  const inputFileBaseExtension = fileBaseName
    .split('.')
    .pop() as SupportedFileExtensions
  const parsedInputFileName = parseEnvValue(
    inputFileNamePattern,
    targetEnvironmentKey
  )

  const env = await loadFile<AnyObject>(
    path.resolve(inputFolder, parsedInputFileName),
    inputFileExtension
  )

  const base = extendsFromBase
    ? await loadFile<AnyObject>(
        path.resolve(inputFolder, fileBaseName),
        inputFileBaseExtension
      )
    : {}

  const mergedData = deepMerge(base, env)
  return injectEnvValues(mergedData)
}
