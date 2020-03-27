import { execSync } from 'child_process';
import { ConfigManager, Config } from '../../src/lib/ConfigManager';

describe('ConfigManager', () => {
  describe('get()', () => {
    it('Success - dev', () => {
      process.env['TD_WDK_ENV'] = 'dev';

      const result: Config = {
        projectName: 'sample-project-dev',
        param: {
          'td.database': 'test-db',
          'td.table': 'test-table'
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
          'td.database': 'test-db',
          'td.table': 'test-table'
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
          'td.table': 'sample-table'
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
          'td.database': 'expect-db',
          'td.table': 'expect-table'
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

  describe('init()', () => {
    it('Success', () => {
      process.env['TD_WDK_ENV'] = 'dev';

      const configManager = new ConfigManager('./test/lib/configManager/init.yaml');
      const result: Config = {
        projectName: 'sample-project-dev',
        param: {
          'td.database': 'test-db',
          'td.table': 'test-table'
        }
      };

      configManager.init();
      expect(configManager.getWorkflowParam()).toEqual(result);

      execSync('unset TD_WDK_ENV');
    });
  });
});
