import * as fs from 'fs-extra';

export class File {
  constructor(private file: string) {}

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
    fs.writeFileSync(this.file, input + '\n'); // 空行を追加
    return;
  };
}
