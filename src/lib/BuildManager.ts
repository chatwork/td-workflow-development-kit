import * as path from 'path';
import { ConfigManager, Config } from './ConfigManager';
import { Directory } from './Directory';
import { File } from './File';
import * as Log from './Log';

export class BuildManager {
  private srcPath = '/src';
  private distPath = '/dist';
  private config: Config;
  constructor(private directoryPath = './td-wdk', configFilePath = './td-wdk/config.yaml') {
    const configManager = new ConfigManager(configFilePath);
    this.config = configManager.get();
  }

  public build = (): void => {
    const fileList = this.getSrcFileList();

    Log.log('');
    fileList.forEach(filePath => {
      this.buildFile(filePath);
    });
    Log.log('');
  };

  private getSrcFileList = (): string[] => {
    const directory = new Directory(path.join(this.directoryPath, this.srcPath));

    return directory.getFileList();
  };

  private buildFile = (filePath: string): void => {
    const srcFile = new File(path.join(this.directoryPath, this.srcPath, filePath));
    const distFile = new File(path.join(this.directoryPath, this.distPath, filePath));

    const srcData = srcFile.read();

    if (path.extname(filePath) === '.dig') {
      distFile.write(this.getReplacedFileData(srcData));
      Log.buildLog(filePath, `Builded`);
    } else {
      distFile.write(srcData);
      Log.buildLog(filePath, `Copied`);
    }
  };

  private getReplacedFileData = (fileData: string): string => {
    const configParam = this.config.param;

    Object.keys(configParam).forEach(key => {
      const regExp = new RegExp(`###${key}###`, 'g');
      fileData = fileData.replace(regExp, String(configParam[key]));
    });

    return fileData;
  };
}
