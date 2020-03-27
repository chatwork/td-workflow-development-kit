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
        filePath: '/assets/testData/schemaTemplate.yaml',
        targetPath: '/test/schema/schema.yaml'
      },
      {
        filePath: '/assets/testData/testDataTemplate.csv',
        targetPath: '/test/csv/test-table.csv'
      },
      {
        filePath: '/assets/testData/expectDataTemplate.csv',
        targetPath: '/test/csv/expect-table.csv'
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
    const gitIgnoreTemplateFile = new File(
      path.join(path.resolve(__dirname, '../../'), templateFilePath)
    );

    const gitIgnoreFile = new File(this.directoryPath + targetPath);
    gitIgnoreFile.write(gitIgnoreTemplateFile.read());
  };
}
