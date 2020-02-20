import { CommandLoader } from './cli/CommandLoader';
import { Command } from 'commander';
const program = new Command();

// バージョン情報
program.version(require('../package.json').version || '1.0.0', '-v, --version');

const commandLoader = new CommandLoader(program);
commandLoader.load().then(() => {
  program.parse(process.argv);

  // For default, show help
  if (program.args.length === 0) {
    program.help();
  }
});
