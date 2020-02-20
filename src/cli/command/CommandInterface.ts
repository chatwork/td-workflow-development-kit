import { Command } from 'commander';

export interface CommandInterface {
  command(program: Command): void;
}
