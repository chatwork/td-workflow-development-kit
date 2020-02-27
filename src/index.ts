import { CommandLoader } from './cli/CommandLoader';
import { Command } from 'commander';
const program = new Command();

// バージョン情報
program.version(require('../package.json').version || '1.0.0', '-v, --version');

const commandLoader = new CommandLoader(program);
commandLoader.load().then(() => {
  program.parse(process.argv);

  // For default, show help
  const rawArgs = process.argv.filter(
    argv => argv.indexOf('bin/node') === -1 && argv.indexOf('bin/td-wdk') === -1
  );
  if (rawArgs.length === 0) {
    program.help();
  }
});
