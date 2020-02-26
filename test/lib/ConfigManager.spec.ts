import { execSync } from 'child_process';
import { ConfigManager, Config } from '../../src/lib/ConfigManager';

describe('ConfigManager', () => {
  describe('get()', () => {
    it('Success - dev', () => {
      process.env['TD_WDK_ENV'] = 'dev';

      const result: Config = {
        projectName: 'sample-project',
        param: {
          td: {
            database: 'test-db',
            table: 'test-table'
          }
        }
      };

      const configManager = new ConfigManager('./test/lib/configManager/config.yaml');
      expect(configManager.get()).toEqual(result);

      execSync('unset TD_WDK_ENV');
    });

    it('Success - no defined environment variable', () => {
      execSync('unset TD_WDK_ENV');

      const result: Config = {
        projectName: 'sample-project',
        param: {
          // dev
          td: {
            database: 'test-db',
            table: 'test-table'
          }
        }
      };

      const configManager = new ConfigManager('./test/lib/configManager/config.yaml');
      expect(configManager.get()).toEqual(result);
    });

    it('Success - prd', () => {
      process.env['TD_WDK_ENV'] = 'prd';

      const result: Config = {
        projectName: 'sample-project',
        param: {
          td: {
            database: 'sample-db',
            table: 'sample-table'
          }
        }
      };

      const configManager = new ConfigManager('./test/lib/configManager/config.yaml');
      expect(configManager.get()).toEqual(result);

      execSync('unset TD_WDK_ENV');
    });

    it('Error - missing environment variable', () => {
      process.env['TD_WDK_ENV'] = 'hoge';

      const configManager = new ConfigManager('./test/lib/configManager/config.yaml');

      expect(() => {
        configManager.get();
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
        projectName: 'sample-project',
        param: {
          td: {
            database: 'test-db',
            table: 'test-table'
          }
        }
      };

      configManager.init();
      expect(configManager.get()).toEqual(result);

      execSync('unset TD_WDK_ENV');
    });
  });
});
