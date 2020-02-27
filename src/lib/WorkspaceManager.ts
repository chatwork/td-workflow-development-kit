import * as path from 'path';
import { File } from './File';
import { ConfigManager } from './ConfigManager';
import { WorkflowManager } from './WorkflowManager';

// cSpell:ignore gitignore

export class WorkspaceManager {
  constructor(private directoryPath = `./td-wdk`) {}

  public create = (
    configManager = new ConfigManager(this.directoryPath + '/config.yaml'),
    workflowManager = new WorkflowManager(this.directoryPath + '/src/sample.dig'),
    configFilePath = '/assets/configTemplate.yaml',
    workflowFilePath = '/assets/workflowTemplate.dig',
    gitignoreFilePath = '/assets/gitignoreTemplate'
  ): void => {
    // make ConfigFile
    configManager.init(configFilePath);

    // make SampleWorkflowFile
    workflowManager.init(workflowFilePath);

    // make .gitignore
    this.initIgnoreFile(gitignoreFilePath);
  };

  private initIgnoreFile = (templateFilePath = '/assets/gitignoreTemplate'): void => {
    const gitIgnoreTemplateFile = new File(
      path.join(path.resolve(__dirname, '../../'), templateFilePath)
    );

    const gitIgnoreFile = new File(this.directoryPath + '/.gitignore');
    gitIgnoreFile.write(gitIgnoreTemplateFile.read());
  };
}
