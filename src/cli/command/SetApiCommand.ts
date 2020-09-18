import commander from 'commander';
import { CommandInterface } from './CommandInterface';
import { Log } from '../../lib/Log';
import { APIKeyManager } from '../../lib/APIKeyManager';

export class SetApiCommand implements CommandInterface {
  public command = (program: commander.Command): void => {
    program
      .command('set-api <API_KEY>')
      .description('Set the API key')
      .action((apiKey) => {
        this.run(apiKey);
      });
  };

  private run = (apiKey: string): void => {
    const log = new Log();
    log.start('Setting API Key...');

    try {
      const apiKeyManager = new APIKeyManager();
      apiKeyManager.set(apiKey);

      log.succeed('API-Key saved successfully.');
    } catch (error) {
      log.fail('API-Key save failed.', error);
    }
  };
}
