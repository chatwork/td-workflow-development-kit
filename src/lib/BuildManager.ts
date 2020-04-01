import * as path from 'path';
import { ConfigManager, Config } from './ConfigManager';
import { Directory } from './Directory';
import { File } from './File';
import { Log } from './Log';

export class BuildManager {
  private srcPath = '/src';
  private distPath = '/dist';
  private config: Config;
  private configManager: ConfigManager;
  constructor(
    private log: Log,
    private directoryPath = './td-wdk',
    configFilePath = './td-wdk/config.yaml'
  ) {
    this.configManager = new ConfigManager(configFilePath);
    this.config = this.configManager.getWorkflowParam();
  }

  public build = (): void => {
    this.deleteDistDirectory();
    const fileList = this.getSrcFileList();

    this.log.printText(``);
    fileList.forEach(filePath => {
      this.buildFile(filePath);
    });
    this.log.printText(``);
  };

  public buildForTest = (distPath: string, env: string): void => {
    const tempDistPath = this.distPath;
    this.distPath = distPath;

    this.config = this.configManager.getWorkflowParam(env);

    const fileList = this.getSrcFileList();

    fileList.forEach(filePath => {
      this.buildFile(filePath, false);
    });

    this.distPath = tempDistPath;
    this.config = this.configManager.getWorkflowParam();
  };

  private getSrcFileList = (): string[] => {
    const directory = new Directory(path.join(this.directoryPath, this.srcPath));

    return directory.getFileList();
  };

  private deleteDistDirectory = (): void => {
    const distDirectory = new Directory(path.join(this.directoryPath, this.distPath));
    distDirectory.delete();
  };

  private buildFile = (filePath: string, printLog = true): void => {
    const srcFile = new File(path.join(this.directoryPath, this.srcPath, filePath));
    const distFile = new File(path.join(this.directoryPath, this.distPath, filePath));

    const srcData = srcFile.read();

    if (path.extname(filePath) === '.dig') {
      distFile.write(this.getReplacedFileData(srcData));
      if (printLog) this.log.printBuildText(filePath, `Builded`);
    } else {
      distFile.write(srcData);
      if (printLog) this.log.printBuildText(filePath, `Copied`);
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
