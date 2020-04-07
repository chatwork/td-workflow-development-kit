import * as path from 'path';
import { TreasureData, TreasureDataSecret } from 'td-workflow-client';
import { ConfigManager, Config } from './ConfigManager';
import { APIKeyManager } from './APIKeyManager';

export class DeployManager {
  private distPath = '/dist';
  private config: Config;
  private apiKey: TreasureDataSecret;
  constructor(
    private directoryPath = './td-wdk',
    configFilePath = './td-wdk/config.yaml',
    apiKeyFilePath?: string
  ) {
    const configManager = new ConfigManager(configFilePath);
    this.config = configManager.getWorkflowParam();

    const apiKeyManager = new APIKeyManager(apiKeyFilePath);
    this.apiKey = {
      API_TOKEN: apiKeyManager.get()
    };
  }

  public deploy = async (): Promise<void> => {
    const treasureData = new TreasureData(this.apiKey);

    await treasureData.deployWorkflow(
      path.join(this.directoryPath, this.distPath),
      path.join(this.directoryPath, this.config.projectName + '.zip'),
      this.config.projectName
    );
  };
}
