import * as path from 'path';
import * as yaml from 'yaml';
import { File } from './File';

interface ConfigParameter {
  [key: string]: unknown;
}

export type Config = OutputConfig;

interface OutputConfig {
  projectName: string;
  param: ConfigParameter;
}

interface RawConfig {
  projectName: string;
  env: {
    [env: string]: ConfigParameter;
  };
}

export class ConfigManager {
  private env: string;
  constructor(private filePath = `./td-wdk/config.yaml`) {
    if (process.env['TD_WDK_ENV']) {
      this.env = process.env['TD_WDK_ENV'];
    } else {
      this.env = 'dev';
    }
  }

  public get = (): OutputConfig => {
    const file = new File(this.filePath);
    const rawConfig = yaml.parse(file.read()) as RawConfig;

    if (!rawConfig.env[this.env]) {
      throw new Error(
        `Variable for specified environment does not exist. - '${process.env['TD_WDK_ENV']}'`
      );
    }

    return {
      projectName: rawConfig.projectName,
      param: rawConfig.env[this.env]
    };
  };

  public init = (templateFilePath = '/assets/configTemplate.yaml'): void => {
    const templateFile = new File(path.join(path.resolve(__dirname, '../../'), templateFilePath));

    const file = new File(this.filePath);
    file.write(templateFile.read());
  };
}
