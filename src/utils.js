import chalk from "chalk";

export function handleError(message, code = 1) {
  console.error(chalk.red(`vz-env: ${message}`));
  process.exit(code);
}

export function handleMessage(message) {
  console.log(chalk.green(`vz-env: ${message}`));
}

export function handleWarning(message) {
  console.warn(chalk.yellow(`vz-env: ${message}`));
}
