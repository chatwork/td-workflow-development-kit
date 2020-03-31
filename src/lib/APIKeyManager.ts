import { File } from './File';

// cSpell:ignore USERPROFILE

export class APIKeyManager {
  constructor(
    private filePath = `${
      process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'] // ホームディレクトリ
    }/.td-wdk`
  ) {}

  public get = (): string => {
    const file = new File(this.filePath);
    try {
      return file.read();
    } catch (error) {
      throw new Error('API Key not set.');
    }
  };

  public set = (apiKey: string): void => {
    const file = new File(this.filePath);
    file.write(apiKey);
  };
}
