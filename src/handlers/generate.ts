import path from 'path'
import { exit } from 'process'
import { configFileName, DefaultConfigSchema } from '../constants/configSchema'
import { SupportedFileExtensions } from '../enums/index'
import { loadJsonFile, writeFile } from '../utils/fileSystem'
import logger from '../utils/logger'
import { validateConfigSchema } from '../utils/validators'
import { getEnvironmentGroup, getEnvironmentTarget } from '../utils/environment'

const generate = async (_params, options) => {
  // read the config file
  const filePath = options.file || configFileName
  const config = await loadJsonFile<DefaultConfigSchema>(filePath)
  const { isValid, errors } = validateConfigSchema(config)
  if (!isValid) {
    for (const error of errors) {
      const { instancePath, message } = error
      logger.error(`Error in config file: ${instancePath} ${message}`)
    }
    exit(1)
  }

  const {
    configurationGroups = [],
    envTargetKey = 'NODE_ENV',
    defaultEnvTargetValue = 'development',
  } = config

  try {
    for (const group of configurationGroups) {
      const { inputFolder, outputFile, extendsFromBase } = group

      const targetEnvironment = getEnvironmentTarget(
        envTargetKey,
        defaultEnvTargetValue
      )

      const fileContent = await getEnvironmentGroup(
        inputFolder,
        extendsFromBase,
        targetEnvironment
      )

      // extract path, filename and extension from the output file
      const { dir, name, ext } = path.parse(outputFile)
      const extension = ext.replace('.', '') as SupportedFileExtensions

      await writeFile({
        data: fileContent,
        extension,
        folder: dir,
        filename: name,
      })

      logger.success(`Envionment file generated: ${outputFile}`)
    }
  } catch (error) {
    logger.error(`Error while generating configuration files: ${error}`)
  }
}

export default generate
