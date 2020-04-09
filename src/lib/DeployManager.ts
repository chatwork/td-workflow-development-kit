import * as path from 'path';
import { TreasureData, TreasureDataSecret } from 'td-workflow-client';
import { ConfigManager } from './ConfigManager';
import { APIKeyManager } from './APIKeyManager';

export class DeployManager {
  private apiKey: TreasureDataSecret;
  private configManager: ConfigManager;
  constructor(
    private directoryPath = './td-wdk',
    configFilePath = './td-wdk/config.yaml',
    apiKeyFilePath?: string
  ) {
    this.configManager = new ConfigManager(configFilePath);

    const apiKeyManager = new APIKeyManager(apiKeyFilePath);
    this.apiKey = {
      API_TOKEN: apiKeyManager.get()
    };
  }

  public deploy = async (distPath = '/dist', env?: string): Promise<void> => {
    const config = this.configManager.getWorkflowParam(env);
    const treasureData = new TreasureData(this.apiKey);

    await treasureData.deployWorkflow(
      path.join(this.directoryPath, distPath),
      path.join(this.directoryPath, config.projectName + '.zip'),
      config.projectName
    );
  };
}
