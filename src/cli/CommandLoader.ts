import { Command } from 'commander';
import { SetApiCommand } from './command/SetApiCommand';
import { CreateCommand } from './command/CreateCommand';
import { TestCommand } from './command/TestCommand';
import { BuildCommand } from './command/BuildCommand';
import { DeployCommand } from './command/DeployCommand';

export class CommandLoader {
  constructor(private program: Command) {}

  public load = async (): Promise<void> => {
    new SetApiCommand().command(this.program);
    new CreateCommand().command(this.program);
    new TestCommand().command(this.program);
    new BuildCommand().command(this.program);
    new DeployCommand().command(this.program);
  };
}
