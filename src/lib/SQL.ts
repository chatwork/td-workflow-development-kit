import * as path from 'path';
import csv from 'csv-parse/lib/sync';
import * as yaml from 'yaml';
import { File } from './File';
import { TestConfig } from './ConfigManager';

//cSpell:word VARCHAR

const allowType: readonly string[] = ['INT', 'DOUBLE', 'VARCHAR'] as const; // 大文字で定義

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

    const createTableSQLText = this.getCreateTableSQL(config.name, schemas);
    const insertIntoSQLText = this.getInsertIntoSQL(config.name, schemas, dataFile.read());

    const sqlText = `${createTableSQLText}\n\n${insertIntoSQLText}`;

    const sqlFile = new File(path.join(this.targetPackagePath, `/sql/${config.name}.sql`));
    sqlFile.write(sqlText);
  };

  private getCreateTableSQL = (tableName: string, schemas: Schema[]): string => {
    const schemaForCreateTable = schemas.map(schema => {
      // Schema の型定義が規定通りかチェック（小文字でも OK とする）
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

    const insertValueTexts = csvData.map(data => {
      const dataValues = schemas.map(schema => {
        // Schema の配列を回してデータを取得してるが、CSV データで列が見つからない場合はエラーとする
        if (!data[schema.name]) {
          throw new Error(
            `[Config.test.tables] Schema has mismatched column name. => '${tableName}.${schema.name}'`
          );
        }

        if (data[schema.name].toUpperCase() === 'NULL') {
          return 'NULL';
        }

        if (schema.type === 'VARCHAR') {
          return `'${data[schema.name]}'`;
        }

        return `${data[schema.name]}`;
      });

      return `( ${dataValues.join(', ')} )`;
    });

    return `INSERT INTO "${tableName}" (${schemaForInsertInto.join(
      ', '
    )}) VALUES\n  ${insertValueTexts.join(',\n  ')}\n;`;
  };

  public generateExpectSQLFile = (config: TestConfig['expects'][0]): void => {
    const schemas = config.columns;
    const schemaWithQuote = schemas.map(schema => `"${schema}"`);

    const sqlText = `SELECT ${schemaWithQuote.join(', ')} FROM "${
      config.srcTable
    }" EXCEPT SELECT ${schemaWithQuote.join(', ')} FROM "${config.expectTable}"`;

    const sqlFile = new File(
      path.join(this.targetPackagePath, `/sql/expect/${config.srcTable}.sql`)
    );
    sqlFile.write(sqlText);
  };
}
