import * as path from 'path';
import * as yaml from 'yaml';
import chalk from 'chalk';
import {
  TreasureData,
  TreasureDataSecret,
  TreasureDataGetExecutedWorkflowTasksOutput,
  TreasureDataGetExecutedWorkflowTasksOutputElement,
} from 'td-workflow-client';
import { ConfigManager, Config, TestConfig } from './ConfigManager';
import { BuildManager } from './BuildManager';
import { DeployManager } from './DeployManager';
import { APIKeyManager } from './APIKeyManager';
import { Directory } from './Directory';
import { SQL } from './SQL';
import { File } from './File';
import { LogForTest } from './Log';

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

interface TasksOutputElement extends TreasureDataGetExecutedWorkflowTasksOutputElement {
  storeParams: {
    td: {
      last_results?: {
        [column: string]: unknown;
      };
      last_job_id: string;
      last_job: {
        id: string;
        num_records: number;
      };
    };
  };
  stateParams: {
    job: {
      jobId: string;
      domainKey: string;
      pollIteration: unknown;
      errorPollIteration: unknown;
    };
  };
  error: {
    message: string;
    stacktrace?: string;
  };
}

interface TasksOutputElement extends TreasureDataGetExecutedWorkflowTasksOutput {
  tasks: TasksOutputElement[];
}

export class TestManager {
  private resourceRootPath = '/test';
  private targetPackagePath = '/test/package';
  private apiKeyManager: APIKeyManager;
  private config: TestConfig;
  private workflowConfig: Config;
  constructor(
    private log: LogForTest,
    private directoryPath = './td-wdk',
    configFilePath = './td-wdk/config.yaml',
    apiKeyFilePath?: string
  ) {
    const configManager = new ConfigManager(configFilePath);
    this.config = configManager.getTestParam();
    this.workflowConfig = configManager.getWorkflowParam(this.config.envParam);

    this.apiKeyManager = new APIKeyManager(apiKeyFilePath);
  }

  private getApiKey = (): TreasureDataSecret => {
    return {
      API_TOKEN: this.apiKeyManager.get(),
    };
  };

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
    buildManager.build(path.join(this.targetPackagePath, '/workflow'), this.config.envParam);
    this.log.succeed('Workflow builded successfully.');

    this.log.start('Deploying workflow...');
    const deployManager = new DeployManager(path.join(this.directoryPath, this.resourceRootPath));
    await deployManager.deploy(path.basename(this.targetPackagePath), this.config.envParam);
    this.log.succeed('Workflow deployed successfully.');

    // WF の実行と監視
    const attemptId = await this.executeWorkflow();
    this.log.start('Testing workflow...');
    await this.watchWorkflow(attemptId);
  };

  private deletePackageDirectory = (): void => {
    const distDirectory = new Directory(path.join(this.directoryPath, this.targetPackagePath));
    distDirectory.delete();
  };

  private generateCreateTableSQLFiles = (): void => {
    this.config.tables.forEach((table) => {
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

      this.log.printSQLBuildedText(path.join(this.targetPackagePath, `/sql/${table.name}.sql`));
    });
  };

  private generateExpectSQLFiles = (): void => {
    this.config.expects.forEach((expect) => {
      const sql = new SQL(
        path.join(this.directoryPath, this.resourceRootPath),
        path.join(this.directoryPath, this.targetPackagePath)
      );

      sql.generateExpectSQLFile(expect);

      this.log.printSQLBuildedText(
        path.join(this.targetPackagePath, `/sql/expect/${expect.srcTable}.sql`)
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
        query: `sql/${table.name}.sql`,
      };
    });

    const workflows = this.config.workflows.map(
      (workflow): DefineParam['_export']['workflows'][0] => {
        return `workflow/${workflow.filePath}`;
      }
    );

    const tests = this.config.expects.map((expect): DefineParam['_export']['tests'][0] => {
      return {
        test_table: expect.srcTable,
        expect_table: expect.expectTable,
        query: `sql/expect/${expect.srcTable}.sql`,
      };
    });

    const define: DefineParam = {
      timezone: 'Asia/Tokyo',
      _export: {
        td: {
          database: this.config.database,
        },
        tables: tables,
        workflows: workflows,
        tests: tests,
      },
    };

    const targetWorkflowFile = new File(
      path.join(this.directoryPath, this.targetPackagePath, `define.dig`)
    );
    targetWorkflowFile.write(yaml.stringify(define));
  };

  private executeWorkflow = async (): Promise<string> => {
    this.log.start('Execute workflow...');
    const treasureData = new TreasureData(this.getApiKey());

    const response = await treasureData.executeWorkflow(this.workflowConfig.projectName, 'test');
    this.log.succeed('Workflow executed successfully.');

    const attemptId = response.id;
    this.log.printText(
      `TD workflow log : ` +
        chalk.blue(
          `https://console.treasuredata.com/app/workflows/${response.workflow.id}/sessions/${response.sessionId}`
        )
    );
    return attemptId;
  };

  private watchWorkflow = async (attemptId: string): Promise<void> => {
    const sleep = async (time: number): Promise<void> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    };

    const treasureData = new TreasureData(this.getApiKey());
    /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
    while (true) {
      const response = await treasureData.getExecutedWorkflowStatus(attemptId);
      const workflowDetail = (await treasureData.getExecutedWorkflowTasks(
        attemptId
      )) as TasksOutputElement;
      const numTaskSucceed = workflowDetail.tasks.filter((task) => task.state === 'success').length;

      this.log.changeText(`Testing workflow... (${numTaskSucceed}/${workflowDetail.tasks.length})`);

      if (response.done && !response.success) {
        const errorTask = workflowDetail.tasks.filter((task) => task.state === 'error');
        if (!errorTask.length) throw new Error('Unknown Error');
        throw new Error(this.getErrorMessage(errorTask));
      }

      if (response.done && response.success) {
        return;
      }

      await sleep(500);
    }
  };

  private getErrorMessage = (errorTask: TasksOutputElement[]): string => {
    let errorMessage =
      chalk.bgRed(`[TestWorkflow Error]`) +
      ` An error occurred in task : '${errorTask[0].fullName}'`;

    // エラーメッセージが存在する場合
    if (errorTask[0].error.message) {
      errorMessage +=
        `, Workflow error message : '` + chalk.yellow(`${errorTask[0].error.message}`) + `'`;
    }

    // クエリログが含まれている場合
    if (errorTask[0].stateParams.job) {
      errorMessage +=
        `, Query job details : ` +
        chalk.blue(
          `https://console.treasuredata.com/app/jobs/${errorTask[0].stateParams.job.jobId}`
        );
    }

    return errorMessage;
  };
}
