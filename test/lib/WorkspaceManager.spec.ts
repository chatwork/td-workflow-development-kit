import { WorkspaceManager, WorkspaceAssetFilePaths } from '../../src/lib/WorkspaceManager';
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

      const configFilePath = './test/assets/configTemplate.yaml';
      const workflowFilePath = './test/assets/workflowTemplate.dig';
      const filePaths: WorkspaceAssetFilePaths = [
        {
          filePath: './test/assets/gitignoreTemplate',
          targetPath: '/.gitignore',
        },
        {
          filePath: './test/assets/testTemplate/testSchemaTemplate.yaml',
          targetPath: '/test/schema/schema.yaml',
        },
        {
          filePath: './test/assets/testTemplate/expectSchemaTemplate.yaml',
          targetPath: '/test/schema/expect_schema.yaml',
        },
        {
          filePath: './test/assets/testTemplate/testDataTemplate.csv',
          targetPath: '/test/csv/test_table.csv',
        },
        {
          filePath: './test/assets/testTemplate/expectDataTemplate.csv',
          targetPath: '/test/csv/expect_table.csv',
        },
      ];

      workspaceManager.create(
        configManager,
        workflowManager,
        configFilePath,
        workflowFilePath,
        filePaths
      );

      const configTemplateFile = new File(configFilePath);
      const configFile = new File('./test/lib/workspaceManager/td-wdk/config.yaml');
      expect(configTemplateFile.read()).toBe(configFile.read());

      const workflowTemplateFile = new File(workflowFilePath);
      const workflowFile = new File('./test/lib/workspaceManager/td-wdk/src/sample.dig');
      expect(workflowTemplateFile.read()).toBe(workflowFile.read());

      filePaths.forEach((filePath) => {
        const templateFile = new File(filePath.filePath);
        const file = new File('./test/lib/workspaceManager/td-wdk' + filePath.targetPath);
        expect(templateFile.read()).toBe(file.read());
      });
    });
  });
});
