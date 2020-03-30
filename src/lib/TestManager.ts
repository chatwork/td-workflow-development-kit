import * as path from 'path';
import { TreasureDataSecret } from 'td-workflow-client';
import { ConfigManager, TestConfig } from './ConfigManager';
import { APIKeyManager } from './APIKeyManager';
import { Directory } from './Directory';
import { SQL } from './SQL';
import { Log } from './Log';

export class TestManager {
  private resourceRootPath = '/test';
  private targetPackagePath = '/test/package';
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
    this.log.printText('Build sql file.');
    this.log.printText(``);
    this.generateCreateTableSQLFiles();
    this.log.printText(``);
  };

  private deletePackageDirectory = (): void => {
    const distDirectory = new Directory(path.join(this.directoryPath, this.targetPackagePath));
    distDirectory.delete();
  };

  private generateCreateTableSQLFiles = (): void => {
    this.config.tables.forEach(table => {
      if (!table.name.match(/^([a-z0-9_]+)$/)) {
        // TD の table 命名規則にマッチするか確認
        throw new Error(
          `[Config.test.tables] Table name must follow this pattern ^([a-z0-9_]+)$. => '${table.name}'`
        );
      }

      const sql = new SQL(
        path.join(this.directoryPath, this.resourceRootPath),
        path.join(this.directoryPath, this.targetPackagePath)
      );

      sql.generateCreateTableSQLFile(table);

      this.log.printBuildText(
        path.join(this.targetPackagePath, `/sql/${table.name}.sql`),
        `Builded`
      );
    });
  };
}
