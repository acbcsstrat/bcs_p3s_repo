const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = merge(common, {
    mode: 'development',
    devServer: {
      contentBase: "./dist",
      // // compress: true,
      // port: 8081,
      hot: true,
      headers: {      
        "Access-Control-Allow-Origin": "*"
      }

    },  
  	plugins: [
      	new webpack.NamedModulesPlugin(),
      	new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development')
        })    
  	]
});