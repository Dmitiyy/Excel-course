const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: isDev ? 'inline-source-map' : false,
  devServer: {port: 3000, hot: isDev, open: true, writeToDisk: true},
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(sass|css)$/,
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader',
          {
            loader: 'sass-loader',
          },
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html', minify: {
      removeComments: isProd, collapseWhitespace: isProd
    }}),
    new CopyPlugin({
      patterns:[{
        from: path.resolve(__dirname, 'src/favicon.ico'), to: path.resolve(__dirname, 'dist')
      }],
    }),
    new MiniCssExtractPlugin({filename: filename('css')}),
  ],
};