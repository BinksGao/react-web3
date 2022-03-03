'use strict'
process.env.NODE_ENV = 'development'
process.env.BABEL_ENV = 'dev'
const path = require('path')
const common = require('./webpack.web.js')
const merge = require('webpack-merge')
const webpack = require('webpack')

const pathURL = '127.0.0.1'
// const pathURL = '172.18.12.147'
const port = 8070

module.exports = merge(common, {
  devtool: 'eval-source-map',
  entry: {
    main: [
      'react-hot-loader/patch',
      path.resolve(__dirname, '../src/index.tsx')
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js',
    path: path.join(__dirname, '../dist'),
    pathinfo: false,
    publicPath: '/'
  },
  devServer: {
    contentBase: path.join(__dirname, '../'),
    compress: true,
    host: pathURL,
    hot: true,
    open: true,
    port: port,
    inline: true,
    historyApiFallback: true
  },
  mode: process.env.NODE_ENV,
  target: 'web'
})
