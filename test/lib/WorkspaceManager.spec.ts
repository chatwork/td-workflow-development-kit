import { WorkspaceManager } from '../../src/lib/WorkspaceManager';
import { ConfigManager } from '../../src/lib/ConfigManager';
import { WorkflowManager } from '../../src/lib/WorkflowManager';
import { File } from '../../src/lib/File';

// cSpell:ignore gitignore

describe('Workspace', () => {
  describe('init()', () => {
    it('Success', () => {
      const directoryPath = './test/lib/workspaceManager/td-wdk';
      const workspaceManager = new WorkspaceManager(directoryPath);

      const configManager = new ConfigManager(directoryPath + '/config.yaml');
      const workflowManager = new WorkflowManager(directoryPath + '/src/sample.dig');

      const configTemplateFilePath = './test/assets/configTemplate.yaml';
      const workflowTemplateFilePath = './test/assets/workflowTemplate.dig';
      const gitignoreTemplateFilePath = './test/assets/gitignoreTemplate';

      workspaceManager.create(
        configManager,
        workflowManager,
        configTemplateFilePath,
        workflowTemplateFilePath,
        gitignoreTemplateFilePath
      );

      const configTemplateFile = new File(configTemplateFilePath);
      const configFile = new File('./test/lib/workspaceManager/td-wdk/config.yaml');
      expect(configTemplateFile.read()).toBe(configFile.read());

      const workflowTemplateFile = new File(workflowTemplateFilePath);
      const workflowFile = new File('./test/lib/workspaceManager/td-wdk/src/sample.dig');
      expect(workflowTemplateFile.read()).toBe(workflowFile.read());

      const gitignoreTemplateFile = new File(gitignoreTemplateFilePath);
      const gitignoreFile = new File('./test/lib/workspaceManager/td-wdk/.gitignore');
      expect(gitignoreTemplateFile.read()).toBe(gitignoreFile.read());
    });
  });
});
