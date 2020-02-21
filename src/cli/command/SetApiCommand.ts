import { Command } from 'commander';
import { CommandInterface } from './CommandInterface';
import * as Log from '../../lib/Log';
import { APIKeyManager } from '../../lib/APIKeyManager';

export class SetApiCommand implements CommandInterface {
  public command = (program: Command): void => {
    program
      .command('set-api <API_KEY>')
      .description('Set the API key')
      .action(apiKey => {
        this.run(apiKey);
      });
    return;
  };

  private run = (apiKey: string): void => {
    const apiKeyManager = new APIKeyManager();
    try {
      apiKeyManager.set(apiKey);
      Log.success('API-Key saved successfully.');
    } catch (error) {
      Log.error('API-Key save failed.', error);
    }
    return;
  };
}
