import * as path from 'path';
import csv from 'csv-parse/lib/sync';
import * as yaml from 'yaml';
import { File } from './File';
import { TestConfig } from './ConfigManager';

//cSpell:word VARCHAR

type Schema = {
  name: string;
  type: 'INT' | 'DOUBLE' | 'VARCHAR';
};

type CSVRawData = {
  [key: string]: string;
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
    const csvData = csv(dataFile.read(), { columns: true }) as CSVRawData[];

    const insertData = csvData.map(data => {
      const dataElements = schemas.map(schema => {
        if (schema.type === 'VARCHAR') {
          return `"${data[schema.name]}"`;
        }

        return `${data[schema.name]}`;
      });

      return `( ${dataElements.join(', ')} )`;
    });

    const sql = `CREATE TABLE IF NOT EXISTS ${config.name} (
      ${schemaForCreateTable.join(', ')}
    );

    INSERT INTO ${config.name} (${schemaForInsertInto.join(', ')}) VALUES
      ${insertData.join(', ')}
    ;`;

    console.log(sql);
  };
}
