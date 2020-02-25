import * as yaml from 'yaml';
import { File } from './FIle';

interface ConfigParameter {
  [key: string]: unknown;
}

export interface Config {
  projectName: string;
  env: {
    prd: ConfigParameter;
    dev: ConfigParameter;
  };
}

export class ConfigManager {
  constructor(private filePath = `./td-wdk/config.yaml`) {}

  public get = (): Config => {
    const file = new File(this.filePath);
    return yaml.parse(file.read()) as Config;
  };

  public init = (): void => {
    const template: Config = {
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

    const file = new File(this.filePath);
    file.write(yaml.stringify(template));
  };
}
