import { Command } from 'commander';
import { CommandInterface } from './CommandInterface';
import { LogForTest } from '../../lib/Log';
import { TestManager } from '../../lib/TestManager';

export class TestCommand implements CommandInterface {
  public command = (program: Command): void => {
    program
      .command('test')
      .description('Test workflow at td')
      .action(async () => {
        await this.run();
      });
  };

  private run = async (): Promise<void> => {
    const log = new LogForTest();
    log.start('Start workflow test...');

    try {
      const testManager = new TestManager(log);
      await testManager.test();

      log.succeed('Workflow tested successfully.');
    } catch (error) {
      log.fail('Workflow test failed.', error);
    }
  };
}
