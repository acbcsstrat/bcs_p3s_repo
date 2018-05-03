const path = require('path');
const ExtractTextPlugin =  require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, './.'),
  entry: {
    app: [
      './src/scss/main.scss',
      './src/js/index.js'
    ],
    vendor: './src/js/vendor.js'
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].bundle.js'
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
            ]
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
    new ExtractTextPlugin({
      filename: 'main.css'
    }),
      new UglifyJsPlugin({
        sourceMap: true,
        test: /\.js($|\?)/i
      }),
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Testing',
        template: 'index.htm'

      }),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()      
  ]
}