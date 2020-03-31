import { TestManager } from '../../src/lib/TestManager';
import { WorkspaceManager, CreateFilePaths } from '../../src/lib/WorkspaceManager';
import { ConfigManager } from '../../src/lib/ConfigManager';
import { WorkflowManager } from '../../src/lib/WorkflowManager';
import { File } from '../../src/lib/File';
import { Log } from '../../src/lib/Log';

// cSpell:ignore gitignore

console.log = jest.fn().mockImplementation();
describe('TestManager', () => {
  const directoryPath = './test/lib/testManager/td-wdk';
  const workspaceManager = new WorkspaceManager(directoryPath);

  const configManager = new ConfigManager(directoryPath + '/config.yaml');
  const workflowManager = new WorkflowManager(directoryPath + '/src/sample.dig');

  const configFilePath = './test/assets/configTemplate.yaml';
  const workflowFilePath = './test/assets/workflowTemplate.dig';
  const filePaths: CreateFilePaths = [
    {
      filePath: './test/assets/gitignoreTemplate',
      targetPath: '/.gitignore'
    },
    {
      filePath: './test/assets/testTemplate/testSchemaTemplate.yaml',
      targetPath: '/test/schema/test_schema.yaml'
    },
    {
      filePath: './test/assets/testTemplate/expectSchemaTemplate.yaml',
      targetPath: '/test/schema/expect_schema.yaml'
    },
    {
      filePath: './test/assets/testTemplate/testDataTemplate.csv',
      targetPath: '/test/csv/test_table.csv'
    },
    {
      filePath: './test/assets/testTemplate/expectDataTemplate.csv',
      targetPath: '/test/csv/expect_table.csv'
    }
  ];

  const log = new Log();
  log.printText = jest.fn().mockImplementation();
  log.printBuildText = jest.fn().mockImplementation();

  workspaceManager.create(
    configManager,
    workflowManager,
    configFilePath,
    workflowFilePath,
    filePaths
  );

  describe('generateCreateTableSQLFiles()', () => {
    it('Success', () => {
      const tableNames = ['test_table', 'expect_table'];
      const testManager = new TestManager(
        log,
        directoryPath,
        directoryPath + '/config.yaml',
        './test/lib/testManager/.td-wdk'
      );
      testManager['generateCreateTableSQLFiles']();

      tableNames.forEach(tableName => {
        const buildFile = new File(directoryPath + `/test/package/sql/${tableName}.sql`);
        const expectFile = new File(`./test/lib/testManager/${tableName}.sql`);

        expect(buildFile.read()).toBe(expectFile.read());
      });
    });
  });
});
