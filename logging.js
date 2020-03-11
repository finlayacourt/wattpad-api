const chalk = require('chalk')

const success = (context, ...args) => {console.log(chalk.white(chalk.bgGreen  (context)), chalk.green ('success'), ...args)}
const info =    (context, ...args) => {console.log(chalk.white(chalk.bgBlue   (context)), chalk.blue  ('info   '), ...args)}
const warn =    (context, ...args) => {console.log(chalk.white(chalk.bgYellow (context)), chalk.yellow('warn   '), ...args)}
const error =   (context, ...args) => {console.log(chalk.white(chalk.bgRed    (context)), chalk.red   ('error  '), ...args)}


module.exports = {
  success,
  info,
  warn,
  error
}