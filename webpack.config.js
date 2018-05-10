const path = require('path');
const ExtractTextPlugin =  require('extract-text-webpack-plugin');
// const MinifyPlugin = require("babel-minify-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	mode: 'production',
	// context: path.resolve(__dirname, './.'),
	entry: {
		vendor: './src/js/vendor.js',		
		app: './src/js/index.js',
		style: './src/scss/main.scss'
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		publicPath: "/p3sweb/",
		filename: '[name].bundle.js'
	},
	resolve: {
		alias: {
			localScripts: path.resolve(__dirname, 'assets'),
			app: path.resolve(__dirname, 'app'),
		}	
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
		        include: [
		          path.resolve(__dirname, "./src/scss")
		        ],
		        exclude: [
		          path.resolve(__dirname, "node_modules")
		        ],
				use: ExtractTextPlugin.extract({
		         	use: [
			            {
			                loader: 'css-loader',
			                options: {
			                    // If you are having trouble with urls not resolving add this setting.
			                    // See https://github.com/webpack-contrib/css-loader#url
			                    url: false,
			                    minimize: true,
			                    sourceMap: true
			                }
			            }, 
			            {
			                loader: 'sass-loader',
			                options: {
			                    sourceMap: true
			                }
			            }
		          	],
					fallback: 'style-loader'
				})
			},
		    {
		        test: /\.(png|svg|jpg|gif)$/,
	         	use: [
	           		'file-loader'
	         	],
		        exclude: [
		          path.resolve(__dirname, "node_modules")
		        ],
		    }    
		]
	},
   	devServer: {
     	contentBase: path.join(__dirname, "./dist"),
     	compress: true,
     	port: 9000,
     	hot: true
   	},	
	plugins: [
		new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/), //needed for bug in moment
		new ExtractTextPlugin({
			filename: 'main.css'
		}),
	  	new UglifyJsPlugin({
	  		sourceMap: true,
	    	test: /\.js($|\?)/i,
	    	exclude: [
	    		path.resolve(__dirname, "node_modules")
	    	]
	  	}),
	  	new CleanWebpackPlugin(['dist']),
	  	new HtmlWebpackPlugin({
	  		inject: false,
	  		title: 'Testing',
	  		template: 'index.htm'

	  	}),
     	new webpack.NamedModulesPlugin(),
     	new webpack.HotModuleReplacementPlugin()	  	
	]
}