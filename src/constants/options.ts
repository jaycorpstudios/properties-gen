import { InitialGroupOptions } from '../enums/index'

export const promptOptions = [
  {
    type: 'select',
    name: 'initialGroups',
    message: 'Which initial groups do you want to create?',
    choices: [
      { title: 'Server', value: InitialGroupOptions.SERVER },
      { title: 'Client', value: InitialGroupOptions.CLIENT },
      { title: 'Both server and client', value: InitialGroupOptions.BOTH },
    ],
  },
]

export const confirmOverwritePrompt = {
  type: 'confirm',
  name: 'overwrite',
  message: 'Do you want to overwrite the existing config file?',
  initial: false,
}
