#!/usr/bin/env node

import commander from 'commander'
import generate from './handlers/generate'
import initCommand from './handlers/init'

const program = new commander.Command()

// Init command (generates default config file)
program
  .command('init')
  .description('Generates default config file')
  .action(initCommand)

// generate command optionally takes a file path as argument -f
program
  .command('generate', { isDefault: true })
  .description('Generates environment properties files')
  .option('-f, --file [pathToFile]', 'Specify configuration file')
  .action(generate)

program.parse(process.argv)
