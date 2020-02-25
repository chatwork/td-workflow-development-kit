import * as path from 'path';
import { File } from './FIle';
import { ConfigManager } from './ConfigManager';
import { WorkflowManager } from './WorkflowManager';

// cSpell:ignore gitignore

export class WorkspaceManager {
  constructor(private directoryPath = `./td-wdk`) {}

  public create = (): void => {
    // make ConfigFile
    const configManager = new ConfigManager(this.directoryPath + '/config.yaml');
    configManager.init();

    // make .gitignore
    const gitIgnoreTemplateFile = new File(
      path.resolve(__dirname, '../../') + '/assets/gitignoreTemplate'
    );
    const gitIgnoreFile = new File(this.directoryPath + '/.gitignore');
    gitIgnoreFile.write(gitIgnoreTemplateFile.read());

    // make SampleWorkflowFile
    const workflowManager = new WorkflowManager(this.directoryPath + '/src/sample.dig');
    workflowManager.init();
  };
}
