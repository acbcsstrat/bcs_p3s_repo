const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    // vendor: './src/js/vendor.js',   
    app: './src/js/app.js'
    // style: './src/scss/main.scss'
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  resolve: {
    alias: {
      localScripts: path.resolve(__dirname, 'assets')
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true,
              },
            },            
        ]
      }, 
      { 
        test: /\.(html|tpl)$/, 
        loader: 'html-loader' 
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'css-loader', options: { url: false, sourceMap: true } },
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' }
        ]
      },      
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, "./src/scss")
        ],
        // exclude: [
        //   path.resolve(__dirname, "node_modules")
        // ],        
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          { 
            loader: 'css-loader', 
            options: { 
              url: false, sourceMap: true 
            } 
          },
          { 
            loader: 'sass-loader', 
            options: { 
              sourceMap: true 
            } 
          }
        ]
      },
      { 
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
        loader: 'url-loader?limit=100000' 
      }
    ]
  },
  // cache: false,
  plugins: [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    }),  
    new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/), //needed for bug in moment
    new HtmlWebpackPlugin({
      inject: true,
      title: 'Patent Place',
      template: 'indexxx.html',    
      filename:'index.html'

    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()      
  ]
}