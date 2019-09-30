const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  devtool: 'source-map',
  entry: {
    // vendor: './src/js/vendor.js',   
    app: './src/js/app.js',
    style: './src/scss/main.scss'
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: '[name].[contentHash].js'
  },
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: { //extract third-party libraries, such as lodash or react, to a separate vendor chunk as they are less likely to change than our local source code
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: 'vendors',
           chunks: 'all',
         },
       },
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
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader'
      },
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
          { 
            loader: MiniCssExtractPlugin.loader, 
            options: { sourceMap: true } 
          },
          { loader: 'css-loader', options: { url: false, sourceMap: true } },
          { 
            loader: 'style-loader' 
          }
        ]
      },      
      {
          test: /\.s?[ac]ss$/,
          use: [
              'style-loader',
              MiniCssExtractPlugin.loader,
              { loader: 'css-loader', options: { url: false, sourceMap: true } },
              { loader: 'sass-loader', options: { sourceMap: true } }
              // {
              //   loader: 'postcss-loader', // Run post css actions

              //   options: {
              //     sourceMap: true,
              //     parser: "postcss-scss",
              //     plugins: function () { // post css plugins, can be exported to postcss.config.js
              //       return [
              //         require('precss'),
              //         require('autoprefixer')
              //       ];
              //     }
              //   }
              // }
          ],
      },
      { 
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
        loader: 'url-loader?limit=100000' 
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      sourceMap: true,
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    }),  
    new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/), //needed for bug in moment
    new HtmlWebpackPlugin({
      inject: true,
      title: 'Patent Place',
      template: 'distindex.html',    
      filename:'index.html'

    }),  
    new webpack.NamedModulesPlugin(),
    // new webpack.HotModuleReplacementPlugin()      commented out for use of contentHash. has to be used if HMR is used
  ]
}