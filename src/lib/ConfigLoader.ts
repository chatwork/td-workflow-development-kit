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

export class ConfigLoader {
  constructor(private filePath = `./td-wdk/config.yaml`) {}

  public get = (): Config => {
    const file = new File(this.filePath);
    return yaml.parse(file.read());
  };
}
