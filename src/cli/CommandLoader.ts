import { Command } from 'commander';
import { SetApiCommand } from './command/SetApiCommand';

export class CommandLoader {
  constructor(private program: Command) {}

  public load = async (): Promise<void> => {
    new SetApiCommand().command(this.program);
    return;
  };
}
