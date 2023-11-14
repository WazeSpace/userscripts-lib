const path = require("path");
const { DefinePlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = env => {
  const isDev = env.NODE_ENV === 'development';

  return {
    mode: isDev ? 'development' : 'production',
    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      library: 'WazeSpace',
      libraryExport: 'default',
    },
    plugins: [
      new DefinePlugin({
        'process.env.VERSION': JSON.stringify(require('./package.json').version),
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: {
              properties: {
                regex: /^_/,
              },
            },
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.ts'],
    },
    target: 'web',
  }
}
