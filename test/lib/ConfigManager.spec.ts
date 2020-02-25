import { ConfigManager, Config } from '../../src/lib/ConfigManager';

describe('ConfigManager', () => {
  describe('get()', () => {
    it('Success', () => {
      const result: Config = {
        projectName: 'sample-project',
        env: {
          prd: {
            td: {
              database: 'sample-db',
              table: 'sample-table'
            }
          },
          dev: {
            td: {
              database: 'test-db',
              table: 'test-table'
            }
          }
        }
      };

      const configManager = new ConfigManager('./test/lib/configManager/config.yaml');
      expect(configManager.get()).toEqual(result);
    });
  });

  describe('init()', () => {
    it('Success', () => {
      const configManager = new ConfigManager('./test/lib/configManager/init.yaml');
      const result: Config = {
        projectName: 'sample-project',
        env: {
          prd: {
            td: {
              database: 'sample-db',
              table: 'sample-table'
            }
          },
          dev: {
            td: {
              database: 'test-db',
              table: 'test-table'
            }
          }
        }
      };

      configManager.init();
      expect(configManager.get()).toEqual(result);
    });
  });
});
