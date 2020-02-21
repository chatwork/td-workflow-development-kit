import * as fs from 'fs-extra';
import * as path from 'path';

export class File {
  private file: string;
  constructor(file: string) {
    this.file = path.resolve(file);
  }

  public read = (): string => {
    if (!fs.existsSync(this.file)) {
      throw new Error('File not found.');
    }

    return fs
      .readFileSync(this.file)
      .toString()
      .slice(0, -1); // 空行を削除
  };

  public write = (input: string): void => {
    fs.mkdirpSync(path.dirname(this.file));
    fs.writeFileSync(this.file, input + '\n'); // 空行を追加
    return;
  };
}
