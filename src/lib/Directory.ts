import * as fs from 'fs-extra';
import * as path from 'path';

export class Directory {
  private directoryPath: string;
  constructor(directoryPath: string) {
    this.directoryPath = path.resolve(directoryPath);
  }

  public getFileList = (): string[] => {
    return this.getFileListOfRecursion();
  };

  private getFileListOfRecursion = (subDirectoryPath = '/'): string[] => {
    const fileList: string[] = [];

    const scanList = fs.readdirSync(path.join(this.directoryPath, subDirectoryPath), {
      encoding: 'utf8',
      withFileTypes: true
    });

    scanList.forEach(file => {
      if (file.isDirectory()) {
        const directoryName = file.name;
        const subDirectoryFileList = this.getFileListOfRecursion(
          path.join(subDirectoryPath, directoryName)
        );

        subDirectoryFileList.forEach(file => {
          fileList.push(file);
        });
      } else {
        fileList.push(path.join(subDirectoryPath, file.name));
      }
    });

    return fileList;
  };

  public delete = (): void => {
    fs.removeSync(this.directoryPath);
  };
}
