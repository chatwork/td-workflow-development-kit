// cSpell:ignore yarg's

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  mode: 'development',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  stats: {
    // Ignore warnings due to yarg's dynamic module loading
    warningsFilter: [/node_modules\/yargs/]
  }
};
