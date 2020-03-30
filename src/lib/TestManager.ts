import * as path from 'path';
import { TreasureData, TreasureDataSecret } from 'td-workflow-client';
import { ConfigManager, TestConfig } from './ConfigManager';
import { APIKeyManager } from './APIKeyManager';
import { Directory } from './Directory';
import { SQL } from './SQL';
import { Log } from './Log';

export class TestManager {
  private resourceRootPath = '/test';
  private testPackagePath = '/test/package';
  private config: TestConfig;
  private apiKey: TreasureDataSecret;
  constructor(
    private log: Log,
    private directoryPath = './td-wdk',
    configFilePath = './td-wdk/config.yaml'
  ) {
    const configManager = new ConfigManager(configFilePath);
    this.config = configManager.getTestParam();

    const apiKeyManager = new APIKeyManager();
    this.apiKey = {
      API_TOKEN: apiKeyManager.get()
    };
  }

  public test = async (): Promise<void> => {
    // 旧ファイルの削除
    this.deletePackageDirectory();

    // テーブル作成用の SQL ファイルを生成
    this.generateCreateTableSQLFiles();

    // define.dig を生成
  };

  private deletePackageDirectory = (): void => {
    const distDirectory = new Directory(path.join(this.directoryPath, this.testPackagePath));
    distDirectory.delete();
  };

  private generateCreateTableSQLFiles = (): void => {
    this.config.tables.forEach(table => {
      if (!table.name.match(/^([a-z0-9_]+)$/)) {
        // TD の table 命名規則にマッチするか確認
        throw new Error(`Table name must follow this pattern ^([a-z0-9_]+)$. => '${table.name}'`);
      }

      const sql = new SQL(path.join(this.directoryPath, this.resourceRootPath));
      sql.generateCreateTableSQLFile(table);
    });
  };
}
