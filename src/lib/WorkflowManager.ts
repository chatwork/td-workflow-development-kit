import * as path from 'path';
import { File } from './FIle';

export class WorkflowManager {
  constructor(private filePath: string) {}

  public init = (): void => {
    const templateFile = new File(
      path.resolve(__dirname, '../../') + '/assets/workflowTemplate.dig'
    );

    const file = new File(this.filePath);
    file.write(templateFile.read());
  };
}
