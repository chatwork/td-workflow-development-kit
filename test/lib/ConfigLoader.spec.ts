import { ConfigLoader, Config } from '../../src/lib/ConfigLoader';

describe('ConfigLoader', () => {
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

      const configLoader = new ConfigLoader('./test/lib/configLoader/config.yaml');
      expect(configLoader.get()).toEqual(result);
    });
  });
});
