import * as path from 'path';
import chalk from 'chalk';
import ora from 'ora';

export class Log {
  protected spinner: ora.Ora;
  constructor() {
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
      text: message,
    });
  };

  public printBuildText = (
    filePath: string,
    state: 'Builded' | 'Copied',
    color: ora.Color = 'cyan'
  ): void => {
    filePath = filePath.slice(1);
    const tag =
      state === 'Builded'
        ? chalk.green.inverse.bold(` ${state} `)
        : chalk.yellow.inverse.bold(` ${state}  `);

    this.spinner.stopAndPersist({
      text: `${tag} ${path.join(
        chalk.blackBright(path.dirname(filePath)),
        chalk.bold(path.basename(filePath))
      )}`,
    });
    this.spinner.color = color;
  };

  public printBuildMargin = (): void => {
    this.spinner.text = '';
    this.spinner.color = 'cyan';
    this.spinner.stopAndPersist({
      symbol: '',
      text: '',
    });
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

export class LogForTest extends Log {
  public printBuildText = (): void => {
    return;
  };

  public printBuildMargin = (): void => {
    return;
  };

  public printSQLBuildedText = (filePath: string, color: ora.Color = 'cyan'): void => {
    filePath = filePath.slice(1);
    const tag = chalk.green.inverse.bold(` Builded `);

    this.spinner.stopAndPersist({
      text: `${tag} ${path.join(
        chalk.blackBright(path.dirname(filePath)),
        chalk.bold(path.basename(filePath))
      )}`,
    });
    this.spinner.color = color;
  };
}
