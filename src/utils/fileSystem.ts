import fs from 'fs.promises'
import path from 'path'
import JSON5 from 'json5'
import { SupportedFileExtensions } from '../enums/index'

interface WriteFileOptions {
  data: any
  extension: SupportedFileExtensions
  folder: string
  filename: string
  useEsModule: boolean
}

export const writeFile = async ({
  data,
  extension,
  folder,
  filename,
  useEsModule = false
}: WriteFileOptions) => {
  const parsedData = stringifyData(data, extension, { useEsModule })
  const folderPath = path.resolve(folder)
  const filePath = `${folder}/${filename}.${extension}`
  await fs.mkdir(folderPath, { recursive: true })
  return await fs.writeFile(filePath, parsedData)
}

const stringifyData = (data: any, extension: SupportedFileExtensions, options: { useEsModule: boolean }) => {
  const isJson = extension === SupportedFileExtensions.JSON
  const body = isJson ? JSON.stringify(data, null, 2) : data
  const fileExportPrefix = options.useEsModule ? 'export default ' : 'module.exports = '
  const parsedData = isJson
    ? body
    : fileExportPrefix + JSON5.stringify(data, { space: 2 })
  return parsedData
}

export const loadJsonFile = async <T>(filePath: string): Promise<T> => {
  const file = await fs.readFile(path.resolve(filePath), { encoding: 'utf8' })
  return JSON.parse(file) as T
}

export const loadFile = async <T>(
  filePath,
  extension: SupportedFileExtensions
) => {
  const loader =
    extension === SupportedFileExtensions.JSON ? loadJsonFile : require
  return loader(filePath) as T
}
