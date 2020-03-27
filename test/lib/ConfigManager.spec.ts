import { execSync } from 'child_process';
import { ConfigManager, Config, TestConfig } from '../../src/lib/ConfigManager';

describe('ConfigManager', () => {
  describe('getWorkflowParam()', () => {
    it('Success - dev', () => {
      process.env['TD_WDK_ENV'] = 'dev';

      const result: Config = {
        projectName: 'sample-project-dev',
        param: {
          'td.database': 'dev-db',
          'td.table': 'dev-table',
          'td.result_table': 'result-dev-table'
        }
      };

      const configManager = new ConfigManager('./test/lib/configManager/config.yaml');
      expect(configManager.getWorkflowParam()).toEqual(result);

      execSync('unset TD_WDK_ENV');
    });

    it('Success - no defined environment variable', () => {
      execSync('unset TD_WDK_ENV');

      const result: Config = {
        projectName: 'sample-project-dev',
        // dev
        param: {
          'td.database': 'dev-db',
          'td.table': 'dev-table',
          'td.result_table': 'result-dev-table'
        }
      };

      const configManager = new ConfigManager('./test/lib/configManager/config.yaml');
      expect(configManager.getWorkflowParam()).toEqual(result);
    });

    it('Success - prd', () => {
      process.env['TD_WDK_ENV'] = 'prd';

      const result: Config = {
        projectName: 'sample-project',
        param: {
          'td.database': 'sample-db',
          'td.table': 'sample-table',
          'td.result_table': 'result-sample-table'
        }
      };

      const configManager = new ConfigManager('./test/lib/configManager/config.yaml');
      expect(configManager.getWorkflowParam()).toEqual(result);

      execSync('unset TD_WDK_ENV');
    });

    it('Success - env name override', () => {
      process.env['TD_WDK_ENV'] = 'dev';

      const result: Config = {
        // config.yaml の env.test のパラメーター
        projectName: 'sample-project-test',
        param: {
          'td.database': 'test-db',
          'td.table': 'test-table',
          'td.result_table': 'result-test-table'
        }
      };

      const configManager = new ConfigManager('./test/lib/configManager/config.yaml');
      expect(configManager.getWorkflowParam('test')).toEqual(result);

      execSync('unset TD_WDK_ENV');
    });

    it('Error - missing environment variable', () => {
      process.env['TD_WDK_ENV'] = 'hoge';

      const configManager = new ConfigManager('./test/lib/configManager/config.yaml');

      expect(() => {
        configManager.getWorkflowParam();
      }).toThrowError(
        new Error(
          `Variable for specified environment does not exist. - '${process.env['TD_WDK_ENV']}'`
        )
      );

      execSync('unset TD_WDK_ENV');
    });
  });

  describe('getTestParam()', () => {
    it('Success', () => {
      const configManager = new ConfigManager('./test/lib/configManager/config.yaml');
      const result: TestConfig = {
        database: 'test-db',
        envParam: 'test',
        workflows: [
          {
            filePath: 'sample.dig'
          }
        ],
        tables: [
          {
            name: 'test-table',
            dataFilePath: 'csv/test-table.csv',
            schemaFilePath: 'schema/schema.yaml'
          },
          {
            name: 'expect-table',
            dataFilePath: 'csv/expect-table.csv',
            schemaFilePath: 'schema/schema.yaml'
          }
        ],
        expects: [
          {
            srcTable: 'result-test-table',
            expectTable: 'expect-table',
            columns: ['name', 'total']
          }
        ]
      };

      expect(configManager.getTestParam()).toEqual(result);
    });
  });

  describe('init()', () => {
    it('Success', () => {
      process.env['TD_WDK_ENV'] = 'dev';

      const configManager = new ConfigManager('./test/lib/configManager/init.yaml');
      const result: Config = {
        projectName: 'sample-project-dev',
        param: {
          'td.database': 'dev-db',
          'td.table': 'dev-table',
          'td.result_table': 'result-dev-table'
        }
      };

      configManager.init();
      expect(configManager.getWorkflowParam()).toEqual(result);

      execSync('unset TD_WDK_ENV');
    });
  });
});
