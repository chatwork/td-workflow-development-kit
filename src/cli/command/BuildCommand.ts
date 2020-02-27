import { Command } from 'commander';
import { CommandInterface } from './CommandInterface';
import * as Log from '../../lib/Log';
import { BuildManager } from '../../lib/BuildManager';

export class BuildCommand implements CommandInterface {
  public command = (program: Command): void => {
    program
      .command('build')
      .description('Build workflow')
      .action(() => {
        this.run();
      });
  };

  private run = (): void => {
    try {
      const buildManager = new BuildManager();
      buildManager.build();
      Log.success('Workflow builded successfully.');
    } catch (error) {
      Log.error('Workflow build failed.', error);
    }
  };
}
