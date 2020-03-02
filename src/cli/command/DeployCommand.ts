import { Command } from 'commander';
import { CommandInterface } from './CommandInterface';
import { Log } from '../../lib/Log';
import { DeployManager } from '../../lib/DeployManager';

export class DeployCommand implements CommandInterface {
  public command = (program: Command): void => {
    program
      .command('deploy')
      .description('Deploy workflow for td')
      .action(async () => {
        await this.run();
      });
  };

  private run = async (): Promise<void> => {
    const log = new Log();
    log.start('Deploying workflow...');

    try {
      const deployManager = new DeployManager();
      await deployManager.deploy();

      log.succeed('Workflow deployed successfully.');
    } catch (error) {
      log.fail('Workflow deploy failed.', error);
    }
  };
}
