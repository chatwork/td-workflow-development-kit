import * as fs from 'fs-extra';

export class File {
  constructor(private location: string) {}

  public read = (): string => {
    if (!fs.existsSync(this.location)) {
      throw new Error('File not found.');
    }

    return fs
      .readFileSync(this.location)
      .toString()
      .slice(0, -1); // 空行を削除
  };

  public write = (input: string): void => {
    fs.writeFileSync(this.location, input + '\n'); // 空行を追加
    return;
  };
}
