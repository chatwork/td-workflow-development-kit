import { execSync } from 'child_process';
import { ConfigManager, Config, TestConfig } from '../../src/lib/ConfigManager';

describe('ConfigManager', () => {
  describe('getWorkflowParam()', () => {
    it('Success - dev', () => {
      process.env['TD_WDK_ENV'] = 'dev';

      const result: Config = {
        projectName: 'sample-project-dev',
        param: {
          'td.database': 'dev_db',
          'td.table': 'dev_table',
          'td.result_table': 'result_dev_table'
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
          'td.database': 'dev_db',
          'td.table': 'dev_table',
          'td.result_table': 'result_dev_table'
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
          'td.database': 'sample_db',
          'td.table': 'sample_table',
          'td.result_table': 'result_sample_table'
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
          'td.database': 'test_db',
          'td.table': 'test_table',
          'td.result_table': 'result_test_table'
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
        database: 'test_db',
        envParam: 'test',
        workflows: [
          {
            filePath: 'sample.dig'
          }
        ],
        tables: [
          {
            name: 'test_table',
            dataFilePath: 'csv/test_table.csv',
            schemaFilePath: 'schema/test_schema.yaml'
          },
          {
            name: 'expect_table',
            dataFilePath: 'csv/expect_table.csv',
            schemaFilePath: 'schema/expect_schema.yaml'
          }
        ],
        expects: [
          {
            srcTable: 'result_test_table',
            expectTable: 'expect_table',
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
          'td.database': 'dev_db',
          'td.table': 'dev_table',
          'td.result_table': 'result_dev_table'
        }
      };

      configManager.init();
      expect(configManager.getWorkflowParam()).toEqual(result);

      execSync('unset TD_WDK_ENV');
    });
  });
});
