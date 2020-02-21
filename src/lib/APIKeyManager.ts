import { File } from './FIle';

// cSpell:ignore USERPROFILE

export class APIKeyManager {
  constructor(
    private filePath = `${
      process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'] // ホームディレクトリ
    }/.td-wdk`
  ) {}

  public get = (): string => {
    const file = new File(this.filePath);
    return file.read();
  };

  public set = (apiKey: string): void => {
    const file = new File(this.filePath);
    file.write(apiKey);
    return;
  };
}
