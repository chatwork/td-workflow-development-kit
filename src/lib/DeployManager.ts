import * as path from 'path';
import { TreasureData, TreasureDataSecret } from 'td-workflow-client';
import { ConfigManager, Config } from './ConfigManager';
import { APIKeyManager } from './APIKeyManager';

export class DeployManager {
  private distPath = '/dist';
  private config: Config;
  private apiKey: TreasureDataSecret;
  private configManager: ConfigManager;
  constructor(
    private directoryPath = './td-wdk',
    configFilePath = './td-wdk/config.yaml',
    apiKeyFilePath?: string
  ) {
    this.configManager = new ConfigManager(configFilePath);
    this.config = this.configManager.getWorkflowParam();

    this.apiKey = {
      API_TOKEN: this.getApiKey(apiKeyFilePath)
    };
  }

  private getApiKey = (apiKeyFilePath?: string): string => {
    const apiKeyManager = new APIKeyManager(apiKeyFilePath);
    return apiKeyManager.get();
  };

  public deploy = async (): Promise<void> => {
    const treasureData = new TreasureData(this.apiKey);

    await treasureData.deployWorkflow(
      path.join(this.directoryPath, this.distPath),
      path.join(this.directoryPath, this.config.projectName + '.zip'),
      this.config.projectName
    );
  };

  public deployForTest = async (distPath: string, env: string): Promise<void> => {
    const tempDistPath = this.distPath;
    this.distPath = distPath;

    this.config = this.configManager.getWorkflowParam(env);
    await this.deploy();

    this.distPath = tempDistPath;
    this.config = this.configManager.getWorkflowParam();
  };
}
