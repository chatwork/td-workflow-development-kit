import * as path from 'path';
import chalk from 'chalk';
import ora from 'ora';

/* eslint-disable @typescript-eslint/no-explicit-any */

export class Log {
  private spinner: ora.Ora;
  constructor(private isForTest = false) {
    this.spinner = ora();
  }

  public start = (message: string, color: ora.Color = 'cyan'): void => {
    this.spinner.text = message;
    this.spinner.color = color;
    this.spinner.start();
  };

  public changeText = (message: string, color: ora.Color = 'cyan'): void => {
    this.spinner.text = message;
    this.spinner.color = color;
  };

  public printText = (message: string, symbol = '', color: ora.Color = 'cyan'): void => {
    this.spinner.text = message;
    this.spinner.color = color;
    this.spinner.stopAndPersist({
      symbol: symbol,
      text: message
    });
  };

  public printBuildText = (
    filePath: string,
    state: 'Builded' | 'Copied',
    color: ora.Color = 'cyan'
  ): void => {
    if (this.isForTest) return;

    filePath = filePath.slice(1);
    const tag =
      state === 'Builded'
        ? chalk.green.inverse.bold(` ${state} `)
        : chalk.yellow.inverse.bold(` ${state}  `);

    this.spinner.stopAndPersist({
      text: `${tag} ${path.join(
        chalk.blackBright(path.dirname(filePath)),
        chalk.bold(path.basename(filePath))
      )}`
    });
    this.spinner.color = color;
  };

  public stop = (): void => {
    this.spinner.stop();
  };

  public succeed = (message: string): void => {
    this.spinner.succeed(message);
  };

  public fail = (message: string, error: Error): void => {
    this.spinner.fail(message);
    console.log();
    throw error;
  };
}
