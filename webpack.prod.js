// const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const ExtractTextPlugin =  require('extract-text-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	devtool: 'source-map',	
  	plugins: [
	    // new ExtractTextPlugin({
	    //   filename: 'main.css'
	    // }),  	
	    new MiniCssExtractPlugin({
	      filename: "main.css"
	    }),
  		new UglifyJsPlugin({
        	sourceMap: true,
        	test: /\.js($|\?)/i
  		}),
  	]
});