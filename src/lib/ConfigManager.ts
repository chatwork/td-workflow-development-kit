import * as path from 'path';
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

  public init = (templateFilePath = '/assets/configTemplate.yaml'): void => {
    const templateFile = new File(path.resolve(__dirname, '../../') + templateFilePath);

    const file = new File(this.filePath);
    file.write(templateFile.read());
  };
}
