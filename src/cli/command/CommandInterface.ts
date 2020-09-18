import commander from 'commander';

export interface CommandInterface {
  command(program: commander.Command): void;
}
