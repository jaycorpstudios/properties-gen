import prompts from 'prompts'
import { configFileName } from '../constants/configSchema'
import { writeFile } from '../utils/fileSystem'
import { SupportedFileExtensions } from '../enums/index'
import { confirmOverwritePrompt, promptOptions } from '../constants/options'
import { getInitialConfig, isConfigFilePresent } from '../utils/configuration'
import logger from '../utils/logger'

export default async function initCommand() {
  const [fileName] = configFileName.split('.json')
  const configIsPresent = await isConfigFilePresent()
  const aggregatedPromtOptions = configIsPresent
    ? [...promptOptions, confirmOverwritePrompt]
    : promptOptions

  const options = await prompts(aggregatedPromtOptions)
  const initialConfig = await getInitialConfig(options.initialGroups)
  const overrideConfig = configIsPresent && options.overwrite
  const actionPerformed = overrideConfig ? 'Overwriting' : 'Generating'

  if (!configIsPresent || overrideConfig) {
    await writeFile({
      data: initialConfig,
      extension: SupportedFileExtensions.JSON,
      folder: './',
      filename: fileName,
    })
    logger.success(`${actionPerformed} Config file`)
  } else {
    logger.warn('Process cancelled')
  }
}
