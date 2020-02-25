import { File } from './FIle';
import { ConfigManager } from './ConfigManager';

// cSpell:ignore gitignore

export class WorkspaceManager {
  constructor(private directoryPath = `./td-wdk`) {}

  public init = (): void => {
    // make ConfigFile
    const configManager = new ConfigManager(this.directoryPath + '/config.yaml');
    configManager.init();

    // make .gitignore
    const gitIgnoreFile = new File(this.directoryPath + '/.gitignore');
    gitIgnoreFile.write('/dist');
  };
}
