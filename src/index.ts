import { CommandLoader } from './cli/CommandLoader';
import commander from 'commander';
const program = commander.program;

// バージョン情報
// eslint-disable-next-line @typescript-eslint/no-var-requires
program.version(require('../package.json').version || '1.0.0', '-v, --version');

const commandLoader = new CommandLoader(program);
commandLoader.load().then(() => {
  program.parse(process.argv);

  // For default, show help
  const rawArgs = process.argv.filter(
    (argv) => argv.indexOf('bin/node') === -1 && argv.indexOf('bin/td-wdk') === -1
  );
  if (rawArgs.length === 0) {
    program.help();
  }
});
