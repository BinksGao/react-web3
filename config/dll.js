const webpack = require('webpack')
const path = require('path')
const _ = require('lodash')
const dependencies = require('../package.json').dependencies
const list = ['@babel/runtime', '@babel/runtime-corejs2', 'normalize.css']

const vendors = _.difference(Object.keys(dependencies), list)

module.exports = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dll'),
    filename: '[name].dll.js',
    library: '[name]_dll'
  },
  entry: {
    vendor: vendors
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      path: path.resolve(__dirname, 'dll', 'manifest.json'),
      name: '[name]_dll'
    })
  ]
}
