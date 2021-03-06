import * as path from 'path';
import * as yaml from 'yaml';
import { File } from './File';

export type Config = OutputParam;
export type TestConfig = TestParam;

interface OutputParam {
  projectName: string;
  param: ConfigOutputParameter;
}

interface TestParam {
  database: string;
  envParam: string;
  workflows: {
    filePath: string;
  }[];
  tables: {
    name: string;
    dataFilePath: string;
    schemaFilePath: string;
  }[];
  expects: {
    srcTable: string;
    expectTable: string;
    columns: string[];
  }[];
}

interface RawConfigData {
  env: {
    [env: string]: {
      projectName: string;
      param: {
        [env: string]: ConfigRawParameter;
      };
    };
  };
  test: TestParam;
}

type ValueType = string | number | boolean;

interface ConfigOutputParameter {
  [key: string]: ValueType;
}

interface ConfigRawParameter {
  [key: string]: ConfigRawParameter | ValueType;
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

  public getWorkflowParam = (envOverride?: string): OutputParam => {
    const env = envOverride ? envOverride : this.env;
    const file = new File(this.filePath);
    const rawConfig = yaml.parse(file.read()) as RawConfigData;

    if (!rawConfig.env[env]) {
      throw new Error(
        `Variable for specified environment does not exist. - '${process.env['TD_WDK_ENV']}'`
      );
    }

    return {
      projectName: rawConfig.env[env].projectName,
      param: this.getConfigParameter(rawConfig.env[env].param),
    };
  };

  private getConfigParameter = (rawConfig: ConfigRawParameter): ConfigOutputParameter => {
    return this.getConfigParameterOfRecursion(rawConfig);
  };

  private getConfigParameterOfRecursion = (
    input: ConfigRawParameter,
    prefix = ''
  ): ConfigOutputParameter => {
    let output: ConfigOutputParameter = {};

    Object.keys(input).forEach((key) => {
      const keyWithPrefix = prefix !== '' ? `${prefix}.${key}` : key;

      // 設定ファイルは配列を受け付けない
      if (Array.isArray(input[key]) === true) {
        throw new Error(`Array not allowed. - '${keyWithPrefix}'`);
      }

      if (typeof input[key] === 'object' && Array.isArray(input[key]) === false) {
        const subObject = this.getConfigParameterOfRecursion(
          input[key] as ConfigRawParameter,
          keyWithPrefix
        );

        output = Object.assign(output, subObject);
      } else {
        output = Object.assign(output, {
          [keyWithPrefix]: input[key],
        });
      }
    });

    return output;
  };

  public getTestParam = (): TestParam => {
    const file = new File(this.filePath);
    const rawConfig = yaml.parse(file.read()) as RawConfigData;

    if (!rawConfig.test) {
      throw new Error(`Variable for specified test does not exist.`);
    }

    return rawConfig.test;
  };

  public init = (templateFilePath = '/assets/configTemplate.yaml'): void => {
    const templateFile = new File(path.join(path.resolve(__dirname, '../../'), templateFilePath));

    const file = new File(this.filePath);
    file.write(templateFile.read());
  };
}
