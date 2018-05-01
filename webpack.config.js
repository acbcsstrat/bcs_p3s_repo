const path = require('path');
const ExtractTextPlugin =  require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "styles.css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
	// context: __dirname + '/app',
	// entry: {
	// 	app: [
	// 		'app.config.js',
	// 		'app.module.js',
	// 		'app.routes.js'
	// 	] 
	// },
	// output: {
	// 	path: __dirname + '/dist',
	// 	filename: 'app.bundle.js'		
	// }
	module: {
		rules: [{
			test: /\.scss$/,
			use: ExtractTextPlugin.extract({
				use: ['css-loader', 'sass-loader'],
				fallback: 'style-loader'
			})
		}]
	},
	plugins: [
		extractSass
	]
}