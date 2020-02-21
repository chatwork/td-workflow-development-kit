import * as fs from 'fs-extra';
import * as path from 'path';
import * as Log from './Log';

export class File {
  private filePath: string;
  constructor(file: string) {
    this.filePath = path.resolve(file);

    Log.debug(`[File] filePath = '${this.filePath}'`);
  }

  public read = (): string => {
    if (!fs.existsSync(this.filePath)) {
      throw new Error('File not found.');
    }

    return fs
      .readFileSync(this.filePath)
      .toString()
      .slice(0, -1); // 空行を削除
  };

  public write = (input: string): void => {
    fs.mkdirpSync(path.dirname(this.filePath));
    fs.writeFileSync(this.filePath, input + '\n'); // 空行を追加
  };
}
