import * as path from 'path';
import csv from 'csv-parse/lib/sync';
import * as yaml from 'yaml';
import { File } from './File';
import { TestConfig } from './ConfigManager';

//cSpell:word VARCHAR

const allowType = ['INT', 'DOUBLE', 'VARCHAR'] as const;

type Schema = {
  name: string;
  type: typeof allowType[number]; // 配列 'allowType' を Union 型の型定義として使える
};

type CSVRawData = {
  [key: string]: string;
};

export class SQL {
  constructor(private resourceRootPath: string, private targetPackagePath: string) {}

  public generateCreateTableSQLFile = (config: TestConfig['tables'][0]): void => {
    const schemaFile = new File(path.join(this.resourceRootPath, config.schemaFilePath));
    const schemas = yaml.parse(schemaFile.read()) as Schema[];

    const dataFile = new File(path.join(this.resourceRootPath, config.dataFilePath));

    const createTableSQL = this.getCreateTableSQL(config.name, schemas);
    const insertIntoSQL = this.getInsertIntoSQL(config.name, schemas, dataFile.read());

    const sqlText = `${createTableSQL}\n\n${insertIntoSQL}`;

    const sqlFile = new File(path.join(this.targetPackagePath, `/sql/${config.name}.sql`));
    sqlFile.write(sqlText);
  };

  private getCreateTableSQL = (tableName: string, schemas: Schema[]): string => {
    const schemaForCreateTable = schemas.map(schema => {
      if (!allowType.includes(schema.type.toUpperCase() as Schema['type'])) {
        throw new Error(
          `[Config.test.tables] Schema has mismatched column type. Allow type in ${allowType.join(
            ', '
          )}. => '${tableName}.${schema.name}': '${schema.type}'`
        );
      }

      return `"${schema.name}" ${schema.type.toUpperCase()}`;
    });

    return `CREATE TABLE IF NOT EXISTS "${tableName}" (\n  ${schemaForCreateTable.join(
      ',\n  '
    )}\n);`;
  };

  private getInsertIntoSQL = (tableName: string, schemas: Schema[], csvText: string): string => {
    const schemaForInsertInto = schemas.map(schema => {
      return `${schema.name}`;
    });

    const csvData = csv(csvText, { columns: true }) as CSVRawData[];

    const insertData = csvData.map(data => {
      const dataElements = schemas.map(schema => {
        if (!data[schema.name]) {
          throw new Error(
            `[Config.test.tables] Schema has mismatched column name. => '${tableName}.${schema.name}'`
          );
        }

        if (schema.type === 'VARCHAR') {
          return `'${data[schema.name]}'`;
        }

        return `${data[schema.name]}`;
      });

      return `( ${dataElements.join(', ')} )`;
    });

    return `INSERT INTO "${tableName}" (${schemaForInsertInto.join(
      ', '
    )}) VALUES\n  ${insertData.join(',\n  ')}\n;`;
  };
}
