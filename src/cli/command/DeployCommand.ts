import { Command } from 'commander';
import { CommandInterface } from './CommandInterface';
import * as Log from '../../lib/Log';
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
    try {
      const deployManager = new DeployManager();
      await deployManager.deploy();
      Log.success('Workflow deployed successfully.');
    } catch (error) {
      Log.error('Workflow deploy failed.', error);
    }
  };
}
