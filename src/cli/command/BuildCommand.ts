import { Command } from 'commander';
import { CommandInterface } from './CommandInterface';
import { Log } from '../../lib/Log';
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
    const spinnerLog = new Log();
    spinnerLog.start('Building workflow...');

    try {
      const buildManager = new BuildManager(spinnerLog);
      buildManager.deleteDistDirectory();
      buildManager.build();

      spinnerLog.succeed('Workflow builded successfully.');
    } catch (error) {
      spinnerLog.fail('Workflow build failed.', error);
    }
  };
}
