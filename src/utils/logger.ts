import chalk from 'chalk'

class Logger {
  log(message: string) {
    console.log(chalk.blue(message))
  }

  info(message: string) {
    console.log(chalk.blue(message))
  }

  error(message: string) {
    console.error(chalk.red(message))
  }

  warn(message: string) {
    console.warn(chalk.yellow(message))
  }
}

export default new Logger()
