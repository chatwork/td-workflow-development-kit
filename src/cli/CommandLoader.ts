import { Command } from 'commander';
import { SetApiCommand } from './command/SetApiCommand';
import { CreateCommand } from './command/CreateCommand';
import { BuildCommand } from './command/BuildCommand';

export class CommandLoader {
  constructor(private program: Command) {}

  public load = async (): Promise<void> => {
    new SetApiCommand().command(this.program);
    new CreateCommand().command(this.program);
    new BuildCommand().command(this.program);
  };
}
