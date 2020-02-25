import { Command } from 'commander';
import { CommandInterface } from './CommandInterface';
import * as Log from '../../lib/Log';

export class CreateCommand implements CommandInterface {
  public command = (program: Command): void => {
    program
      .command('create')
      .description('Create workspace.')
      .action(() => {
        this.run();
      });
  };

  private run = (): void => {
    try {
      Log.success('Workspace initialized successfully.');
    } catch (error) {
      Log.error('Workspace initialize failed.', error);
    }
  };
}
