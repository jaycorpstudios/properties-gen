import chalk from 'chalk'

class Logger {
  prefix: string
  
  constructor(prefix: string) {
    this.prefix = prefix
  }

  log(message: string) {
    console.log(`[${this.prefix}]: ${chalk.blue(message)}`)
  }

  info(message: string) {
    console.log(`[${this.prefix}]: ${chalk.blue(message)}`)
  }

  success(message: string) {
    console.log(`[${this.prefix}]: ${chalk.green(message)}`)
  }

  error(message: string) {
    console.error(`[${this.prefix}]: ${chalk.red(message)}`)
  }

  warn(message: string) {
    console.warn(`[${this.prefix}]: ${chalk.yellow(message)}`)
  }
}

export default new Logger('env-properties')
