import commander from 'commander';
import { CommandInterface } from './CommandInterface';
import { Log } from '../../lib/Log';
import { WorkspaceManager } from '../../lib/WorkspaceManager';

export class CreateCommand implements CommandInterface {
  public command = (program: commander.Command): void => {
    program
      .command('create')
      .description('Create workspace')
      .action(() => {
        this.run();
      });
  };

  private run = (): void => {
    const log = new Log();
    log.start('Creating workspace...');

    try {
      const workspaceManager = new WorkspaceManager();
      workspaceManager.create();

      log.succeed('Workspace created successfully.');
    } catch (error) {
      log.fail('Workspace create failed.', error);
    }
  };
}
