import * as path from 'path';
import csv from 'csv-parse/lib/sync';
import * as yaml from 'yaml';
import { File } from './File';
import { TestConfig } from './ConfigManager';

type Schema = {
  name: string;
  type: 'int' | 'double' | 'string' | string;
};

export class SQL {
  constructor(private resourceRootPath: string) {}

  public generateCreateTableSQLFile = (config: TestConfig['tables'][0]): void => {
    const schemaFile = new File(path.join(this.resourceRootPath, config.schemaFilePath));
    const schemas = yaml.parse(schemaFile.read()) as Schema[];

    const schemaForCreateTable = schemas.map(schema => {
      return `"${schema.name}" ${schema.type}`;
    });
    const schemaForInsertInto = schemas.map(schema => {
      return `${schema.name}`;
    });

    const dataFile = new File(path.join(this.resourceRootPath, config.dataFilePath));
    const csvData = csv(dataFile.read(), { columns: true });

    console.log(csvData);

    const sql = `CREATE TABLE IF NOT EXISTS ${config.name} (
      ${schemaForCreateTable.join(', ')}
    );

    INSERT INTO ${config.name} (${schemaForInsertInto.join(', ')}) VALUES
      (1, 'hoge'),
    (2, 'fuga')
    ;`;

    console.log(sql);
  };
}
