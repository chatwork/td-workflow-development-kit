import { Command } from 'commander';
import { CommandInterface } from './CommandInterface';
import * as Log from '../../lib/Log';
import { WorkspaceManager } from '../../lib/WorkspaceManager';

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
      const workspaceManager = new WorkspaceManager();
      workspaceManager.init();
      Log.success('Workspace initialized successfully.');
    } catch (error) {
      Log.error('Workspace initialize failed.', error);
    }
  };
}
