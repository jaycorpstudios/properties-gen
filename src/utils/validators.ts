import Ajv, { JSONSchemaType } from 'ajv'
import { DefaultConfigSchema } from '../constants/configSchema'

const ajv = new Ajv()

const schema: JSONSchemaType<DefaultConfigSchema> = {
  type: 'object',
  properties: {
    configurationGroups: {
      type: 'array',
      minItems: 1,
      uniqueItems: true,
      items: {
        type: 'object',
        properties: {
          inputFolder: { type: 'string' },
          outputFile: { type: 'string' },
          extendsFromBase: { type: 'boolean' },
        },
        required: ['inputFolder', 'outputFile', 'extendsFromBase'],
        additionalProperties: false,
      },
    },
    envTargetKey: { type: 'string', nullable: true },
    defaultEnvTargetValue: { type: 'string', nullable: true },
  },
  required: ['configurationGroups'],
  additionalProperties: false,
}

export const validateConfigSchema = (data: DefaultConfigSchema) => {
  try {
    const validate = ajv.compile(schema)
    return {
      isValid: validate(data),
      errors: validate.errors || [],
    }
  } catch (error) {
    return {
      isValid: false,
      errors: [{ message: error, instancePath: '' }],
    }
  }
}
