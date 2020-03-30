import * as path from 'path';
import { File } from './File';
import { ConfigManager } from './ConfigManager';
import { WorkflowManager } from './WorkflowManager';

// cSpell:ignore gitignore

export type CreateFilePaths = {
  filePath: string;
  targetPath: string;
}[];

export class WorkspaceManager {
  constructor(private directoryPath = `./td-wdk`) {}

  public create = (
    configManager = new ConfigManager(this.directoryPath + '/config.yaml'),
    workflowManager = new WorkflowManager(this.directoryPath + '/src/sample.dig'),
    configFilePath = '/assets/configTemplate.yaml',
    workflowFilePath = '/assets/workflowTemplate.dig',
    filePaths: CreateFilePaths = [
      {
        filePath: '/assets/gitignoreTemplate',
        targetPath: '/.gitignore'
      },
      {
        filePath: '/assets/testTemplate/testSchemaTemplate.yaml',
        targetPath: '/test/schema/test_schema.yaml'
      },
      {
        filePath: '/assets/testTemplate/expectSchemaTemplate.yaml',
        targetPath: '/test/schema/expect_schema.yaml'
      },
      {
        filePath: '/assets/testTemplate/testDataTemplate.csv',
        targetPath: '/test/csv/test_table.csv'
      },
      {
        filePath: '/assets/testTemplate/expectDataTemplate.csv',
        targetPath: '/test/csv/expect_table.csv'
      }
    ]
  ): void => {
    // make ConfigFile
    configManager.init(configFilePath);

    // make SampleWorkflowFile
    workflowManager.init(workflowFilePath);

    // make .gitignore, schema.yaml, test-table.csv ete...
    filePaths.forEach(filePath => {
      this.initFile(filePath.filePath, filePath.targetPath);
    });
  };

  private initFile = (templateFilePath: string, targetPath: string): void => {
    const templateFile = new File(path.join(path.resolve(__dirname, '../../'), templateFilePath));

    const targetFile = new File(this.directoryPath + targetPath);
    targetFile.write(templateFile.read());
  };
}
