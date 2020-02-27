import * as path from 'path';
import { Directory } from './Directory';

export class BuildManager {
  private srcPath = '/src';
  private distPath = '/dist';
  constructor(
    private directoryPath = './td-wdk',
    private configFilePath = './td-wdk/config.yaml'
  ) {}

  public build = (): void => {
    const fileList = this.getSrcFileList();

    console.log(fileList);
  };

  private getSrcFileList = (): string[] => {
    const directory = new Directory(path.join(this.directoryPath, this.srcPath));

    return directory.getFileList();
  };

  private buildFile = (filePath: string): void => {
    console.log(filePath);
  };

  private getReplacedFileData = (fileData: string): string => {
    return fileData;
  };

  private genZip = (): void => {
    return;
  };
}
