const path = require('path');
const webpack = require('webpack');
const nodeExternal = require('webpack-node-externals');

const environment = process.env.NODE_ENV || 'development';

const webpackConfig = {
  devtool: 'cheap-source-map',
  entry: './src/server.ts',
  mode: environment,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].server.js',
    publicPath: '/',
    libraryTarget: 'commonjs'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      isBrowser: JSON.stringify(false),
      'process.env.NODE_ENV': JSON.stringify(environment)
    }),
    new webpack.IgnorePlugin(/hiredis/)
  ],
  module: {
    rules: [
      {
        test: /\.(t|j)s?$/,
        loaders: ['ts-loader'],
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.ts']
  },
  target: 'node',
  externals: [nodeExternal()]
};

module.exports = webpackConfig;