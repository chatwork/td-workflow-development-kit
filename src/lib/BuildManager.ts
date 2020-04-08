import * as path from 'path';
import { ConfigManager, Config } from './ConfigManager';
import { Directory } from './Directory';
import { File } from './File';
import { Log } from './Log';

export class BuildManager {
  private configManager: ConfigManager;
  constructor(
    private log: Log,
    private directoryPath = './td-wdk',
    configFilePath = './td-wdk/config.yaml'
  ) {
    this.configManager = new ConfigManager(configFilePath);
  }

  public build = (): void => {
    const srcPath = '/src';
    const distPath = '/dist';
    const config = this.configManager.getWorkflowParam();

    this.deleteDistDirectory(distPath);
    const fileList = this.getSrcFileList(srcPath);

    this.log.printText(``);
    fileList.forEach(filePath => {
      this.buildFile(filePath, srcPath, distPath, config);
    });
    this.log.printText(``);
  };

  public buildForTest = (distPath: string, env: string): void => {
    const srcPath = '/src';
    const config = this.configManager.getWorkflowParam(env);

    const fileList = this.getSrcFileList(srcPath);

    fileList.forEach(filePath => {
      this.buildFile(filePath, srcPath, distPath, config);
    });
  };

  private getSrcFileList = (srcPath: string): string[] => {
    const directory = new Directory(path.join(this.directoryPath, srcPath));

    return directory.getFileList();
  };

  private deleteDistDirectory = (distPath: string): void => {
    const distDirectory = new Directory(path.join(this.directoryPath, distPath));
    distDirectory.delete();
  };

  private buildFile = (
    filePath: string,
    srcPath: string,
    distPath: string,
    config: Config
  ): void => {
    const srcFile = new File(path.join(this.directoryPath, srcPath, filePath));
    const distFile = new File(path.join(this.directoryPath, distPath, filePath));

    const srcData = srcFile.read();

    if (path.extname(filePath) === '.dig') {
      distFile.write(this.getReplacedFileData(srcData, config));
      this.log.printBuildText(filePath, `Builded`);
    } else {
      distFile.write(srcData);
      this.log.printBuildText(filePath, `Copied`);
    }
  };

  private getReplacedFileData = (fileData: string, config: Config): string => {
    const configParam = config.param;

    Object.keys(configParam).forEach(key => {
      const regExp = new RegExp(`###${key}###`, 'g');
      fileData = fileData.replace(regExp, String(configParam[key]));
    });

    return fileData;
  };
}
