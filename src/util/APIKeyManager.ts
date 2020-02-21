import { File } from '../lib/FIle';

// cSpell:ignore USERPROFILE

export class APIKeyManager {
  constructor(
    private file = `${
      process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'] // ホームディレクトリ
    }/.td-wdk`
  ) {}

  public get = (): string => {
    const file = new File(this.file);
    return file.read();
  };

  public set = (apiKey: string): void => {
    const file = new File(this.file);
    file.write(apiKey);
    return;
  };
}
