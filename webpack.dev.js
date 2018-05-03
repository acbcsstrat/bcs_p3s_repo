const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
  	devtool: 'inline-source-map',
  	devServer: {
      	contentBase: path.join(__dirname, "./dist"),
      	compress: true,
      	port: 9000,
      	hot: true
    },  
  	plugins: [
      	new webpack.NamedModulesPlugin(),
      	new webpack.HotModuleReplacementPlugin()      
  	]
});