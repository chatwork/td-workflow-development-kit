import { execSync } from 'child_process';
import { BuildManager } from '../../src/lib/BuildManager';
import { WorkspaceManager } from '../../src/lib/WorkspaceManager';
import { ConfigManager } from '../../src/lib/ConfigManager';
import { WorkflowManager } from '../../src/lib/WorkflowManager';
import { File } from '../../src/lib/File';
import { Log } from '../../src/lib/Log';

// cSpell:ignore gitignore

console.log = jest.fn().mockImplementation();

describe('BuildManager', () => {
  describe('build()', () => {
    const directoryPath = './test/lib/buildManager/td-wdk';
    const workspaceManager = new WorkspaceManager(directoryPath);

    const configManager = new ConfigManager(directoryPath + '/config.yaml');
    const workflowManager = new WorkflowManager(directoryPath + '/src/sample.dig');

    const configTemplateFilePath = './test/assets/configTemplate.yaml';
    const workflowTemplateFilePath = './test/assets/workflowTemplate.dig';
    const gitignoreTemplateFilePath = './test/assets/gitignoreTemplate';

    const log = new Log();
    log.printText = jest.fn().mockImplementation();
    log.printBuildText = jest.fn().mockImplementation();

    workspaceManager.create(
      configManager,
      workflowManager,
      configTemplateFilePath,
      workflowTemplateFilePath,
      gitignoreTemplateFilePath
    );

    it('Success - dev', () => {
      process.env['TD_WDK_ENV'] = 'dev';

      const buildManager = new BuildManager(log, directoryPath, directoryPath + '/config.yaml');
      buildManager.build();

      const buildFile = new File(directoryPath + '/dist/sample.dig');
      const resultFile = new File('./test/lib/buildManager/result-dev.dig');

      expect(buildFile.read()).toBe(resultFile.read());

      execSync('unset TD_WDK_ENV');
    });

    it('Success - prd', () => {
      process.env['TD_WDK_ENV'] = 'prd';

      const buildManager = new BuildManager(log, directoryPath, directoryPath + '/config.yaml');
      buildManager.build();

      const buildFile = new File(directoryPath + '/dist/sample.dig');
      const resultFile = new File('./test/lib/buildManager/result-prd.dig');

      expect(buildFile.read()).toBe(resultFile.read());

      execSync('unset TD_WDK_ENV');
    });

    it('Success - with other file', () => {
      // src/sql/sample.sql を作成
      const sqlFileText = 'SELECT * FROM ${td.table}';
      const srcSQLFile = new File(directoryPath + '/src/sql/sample.sql');
      srcSQLFile.write(sqlFileText);

      const buildManager = new BuildManager(log, directoryPath, directoryPath + '/config.yaml');
      buildManager.build();

      // 生成された dist/sql/sample.sql を検証
      const buildFile = new File(directoryPath + '/dist/sql/sample.sql');
      expect(buildFile.read()).toBe(sqlFileText);
    });
  });
});