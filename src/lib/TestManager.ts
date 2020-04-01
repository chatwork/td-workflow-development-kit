import * as path from 'path';
import * as yaml from 'yaml';
import { ConfigManager, TestConfig } from './ConfigManager';
import { BuildManager } from './BuildManager';
import { DeployManager } from './DeployManager';
import { Directory } from './Directory';
import { SQL } from './SQL';
import { File } from './File';
import { Log } from './Log';

// cSpell:word camelcase

type DefineParam = {
  timezone: string;
  _export: {
    td: {
      database: string;
    };
    tables: {
      table: string;
      query: string;
    }[];
    workflows: string[];
    tests: {
      test_table: string;
      expect_table: string;
      query: string;
    }[];
  };
};

export class TestManager {
  private resourceRootPath = '/test';
  private targetPackagePath = '/test/package';
  private config: TestConfig;
  constructor(
    private log: Log,
    private directoryPath = './td-wdk',
    configFilePath = './td-wdk/config.yaml'
  ) {
    const configManager = new ConfigManager(configFilePath);
    this.config = configManager.getTestParam();
  }

  public test = async (): Promise<void> => {
    // 旧ファイルの削除
    this.deletePackageDirectory();

    // テーブル作成用の SQL ファイルを生成
    this.log.printText('Building sql....');
    this.log.printText(``);
    this.generateCreateTableSQLFiles();
    this.log.printText(``);

    // テスト用の SQL ファイルを作成
    this.generateExpectSQLFiles();
    this.log.printText(``);

    this.log.succeed('SQL builded successfully.');

    this.log.start('Building workflow...');
    this.generateWorkflowFile();
    this.generateDefineFile();

    const buildManager = new BuildManager(this.log);
    buildManager.buildForTest(path.join(this.targetPackagePath, '/workflow'), this.config.envParam);
    this.log.succeed('Workflow builded successfully.');

    this.log.start('Deploying workflow...');
    const deployManager = new DeployManager(path.join(this.directoryPath, this.resourceRootPath));
    await deployManager.deployForTest(path.basename(this.targetPackagePath), this.config.envParam);
    this.log.succeed('Workflow deployed successfully.');

    this.log.start('Testing workflow...');
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

  private generateExpectSQLFiles = (): void => {
    this.config.expects.forEach(expect => {
      const sql = new SQL(
        path.join(this.directoryPath, this.resourceRootPath),
        path.join(this.directoryPath, this.targetPackagePath)
      );

      sql.generateExpectSQLFile(expect);

      this.log.printBuildText(
        path.join(this.targetPackagePath, `/sql/expect/${expect.srcTable}.sql`),
        `Builded`
      );
    });
  };

  private generateWorkflowFile = (): void => {
    const sourceWorkflowFile = new File(
      path.join(path.resolve(__dirname, '../../'), '/assets/testWorkflow.dig')
    );
    const targetWorkflowFile = new File(
      path.join(this.directoryPath, this.targetPackagePath, `test.dig`)
    );
    targetWorkflowFile.write(sourceWorkflowFile.read());
  };

  private generateDefineFile = (): void => {
    const tables = this.config.tables.map((table): DefineParam['_export']['tables'][0] => {
      return {
        table: table.name,
        query: `sql/${table.name}.sql`
      };
    });

    const workflows = this.config.workflows.map(
      (workflow): DefineParam['_export']['workflows'][0] => {
        return `workflow/${workflow.filePath}`;
      }
    );

    const tests = this.config.expects.map((expect): DefineParam['_export']['tests'][0] => {
      return {
        // eslint-disable-next-line @typescript-eslint/camelcase
        test_table: expect.srcTable,
        // eslint-disable-next-line @typescript-eslint/camelcase
        expect_table: expect.expectTable,
        query: `sql/expect/${expect.srcTable}.sql`
      };
    });

    const define: DefineParam = {
      timezone: 'Asia/Tokyo',
      _export: {
        td: {
          database: this.config.database
        },
        tables: tables,
        workflows: workflows,
        tests: tests
      }
    };

    const targetWorkflowFile = new File(
      path.join(this.directoryPath, this.targetPackagePath, `define.dig`)
    );
    targetWorkflowFile.write(yaml.stringify(define));
  };
}
