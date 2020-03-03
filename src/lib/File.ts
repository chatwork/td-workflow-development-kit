import * as fs from 'fs-extra';
import * as path from 'path';

export class File {
  private filePath: string;
  constructor(file: string) {
    this.filePath = path.resolve(file);
  }

  public read = (): string => {
    if (!fs.existsSync(this.filePath)) {
      throw new Error(`File not found. - '${this.filePath}'`);
    }

    return fs
      .readFileSync(this.filePath, { encoding: 'utf8' })
      .toString()
      .slice(0, -1); // 空行を削除
  };

  public write = (input: string): void => {
    fs.mkdirpSync(path.dirname(this.filePath));
    fs.writeFileSync(this.filePath, input + '\n', { encoding: 'utf8' }); // 空行を追加
  };
}
