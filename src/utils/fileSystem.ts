import fs from 'fs/promises'
import path from 'path'
import JSON5 from 'json5'
import { SupportedFileExtensions } from '../enums/index'

interface WriteFileOptions {
  data: any
  extension: SupportedFileExtensions
  folder: string
  filename: string
}

export const writeFile = async ({
  data,
  extension,
  folder,
  filename,
}: WriteFileOptions) => {
  const parsedData = stringifyData(data, extension)
  const folderPath = path.resolve(folder)
  const filePath = `${folder}/${filename}.${extension}`
  await fs.mkdir(folderPath, { recursive: true })
  return await fs.writeFile(filePath, parsedData)
}

const stringifyData = (data: any, extension: SupportedFileExtensions) => {
  const isJson = extension === SupportedFileExtensions.JSON
  const body = isJson ? JSON.stringify(data, null, 2) : data
  const parsedData = isJson
    ? body
    : 'module.exports = ' + JSON5.stringify(data, { space: 2 })
  return parsedData
}

export const loadJsonFile = async <T>(filePath: string): Promise<T> => {
  const file = await fs.readFile(path.resolve(filePath), { encoding: 'utf8' })
  return JSON.parse(file) as T
}
