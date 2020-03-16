const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: "inline-cheap-source-map",
  plugins: [
    new MiniCssExtractPlugin({
      sourceMap: true,
      filename: "main.css"
    }),
    new UglifyJsPlugin({
      sourceMap: true,
      test: /\.js($|\?)/i,
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        map: {
          inline: false
        }
      }
    }),
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })    
	]
});