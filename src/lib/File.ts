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

    const readText = fs.readFileSync(this.filePath, { encoding: 'utf8' }).toString();

    // ファイルの最終文字が改行コードの場合はそれを削除する
    if (readText.slice(-1) === '\n' || readText.slice(-1) === '\r') {
      return readText.slice(0, -1);
    }

    return readText;
  };

  public write = (input: string): void => {
    fs.mkdirpSync(path.dirname(this.filePath));
    fs.writeFileSync(this.filePath, input + '\n', { encoding: 'utf8' }); // 空行を追加
  };
}
