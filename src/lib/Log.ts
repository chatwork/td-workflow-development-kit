import * as path from 'path';
import * as logSymbols from 'log-symbols';
import chalk from 'chalk';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function log(message: any): void {
  console.log(message);
}

export function buildLog(filePath: string, state: 'Builded' | 'Copied'): void {
  filePath = filePath.slice(1);
  const tag =
    state === 'Builded'
      ? chalk.green.inverse.bold(` ${state} `)
      : chalk.yellow.inverse.bold(` ${state}  `);

  console.log(
    tag,
    `${path.join(chalk.blackBright(path.dirname(filePath)), chalk.bold(path.basename(filePath)))}`
  );
}

export function success(message: any): void {
  console.info(logSymbols.success, message);
}

export function error(message: any, error: Error): void {
  console.error(logSymbols.error, message);
  console.log();
  throw error;
}
