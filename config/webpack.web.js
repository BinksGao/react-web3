const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const theme = require('./theme.js')
const utils = require('./utils/index')
const webpack = require('webpack')
const moment = require('moment')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const packages = require('../package.json')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length - 1
})
const AssetsPlugin = require('assets-webpack-plugin')
const ShellPlugin = require('./ShellPlugin')
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const devMode = process.env.NODE_ENV !== 'production'
const resolvePath = function (dir) {
  return path.join(__dirname, '..', dir)
}

const getCommitMessage = () => {
  const i = process.argv.indexOf('-m')
  const t = moment().format('YYYY/MM/DD/HH:MM')
  const commandList = []
  if (i < 0) return commandList
  else return [`git add . && git commit -m ${t}-${process.argv[i + 1]}`]
}
module.exports = {
  plugins: [
    new ShellPlugin({ command: getCommitMessage() }),
    // new Wba(),
    new HtmlWebpackPlugin({
      title: process.env.tag === 'whydemo' ? 'metaMask' : 'metaMask',
      filename: 'index.html',
      template: resolvePath('config/index.ejs'),
      hash: true,
      cache: false,
      inject: true,
      favicon: resolvePath('src/assets/images/icon.ico'),
      minify: {
        removeComments: true,
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        minifyJS: true, // 在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
        minifyCSS: true // 缩小CSS样式元素和样式属性
      },
      nodeModules: resolvePath('node_modules')
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
      chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[contenthash:8].css'
    }),
    new AssetsPlugin({
      filename: 'assets.js',
      path: resolvePath('dist/version'),
      update: true,
      metadata: {
        version: packages.version,
        build: moment().format('YYYY.MM.DD HHmmss')
      },
      processOutput: function (assets) {
        Object.assign(process.env, { version: assets.metadata.version, build: assets.metadata.build })
        return `window.WEBPACK_ASSETS=${JSON.stringify(assets)}`
      }
    }),
    new webpack.DefinePlugin({
      'process.env.mode': JSON.stringify(process.env.tag)
    }),
    new HappyPack({
      id: 'css',
      loaders: ['css-loader', 'postcss-loader'],
      threadPool: happyThreadPool
    }),
    new HappyPack({
      id: 'less',
      loaders: ['css-loader',
        'postcss-loader',
        {
          loader: 'less-loader',
          options: {
            modifyVars: theme,
            javascriptEnabled: true
          }
        }
      ],
      threadPool: happyThreadPool
    }),
    new HappyPack({
      id: 'stylus',
      loaders: ['css-loader', 'postcss-loader', 'stylus-loader'],
      threadPool: happyThreadPool
    }),
    new HappyPack({
      id: 'tsxs',
      loaders: [{
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      }],
      threadPool: happyThreadPool
    })
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'assets/images/[name].[ext]'
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'css/fonts/[name]--[folder].[ext]'
          }
        }
      },
      {
        test: /\.less$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'happypack/loader?id=less'
        ]
      },
      {
        test: /\.styl$/,
        include: resolvePath('src'),
        exclude: /node_modules/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'happypack/loader?id=stylus'
        ]
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'happypack/loader?id=css'
        ]
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader'
      },
      {
        test: /\.(j|t)sx?$/,
        use: ['react-hot-loader/webpack']
      },
      {
        test: /\.(ts|tsx)?$/,
        include: resolvePath('src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              transplieOnly: true,
              forceIsolatedModules: true,
              useCache: true,
              cacheDirectory: resolvePath('node_modules/.cache'),
              useBabel: true,
              reportFiles: [
                'src/**/*.{ts,tsx}'
              ],
              babelCore: '@babel/core'
            }
          }
        ]
      },
      {
        test: /\.(ts|tsx)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: ['happypack/loader?id=tsxs']
      }
    ]
  },
  resolve: {
    alias: {
      '@': resolvePath('src'),
      '@components': resolvePath('src/components'),
      '@shared': resolvePath('src/containers/shared'),
      '@pages': resolvePath('src/containers/pages'),
      '@utils': resolvePath('src/utils'),
      '@router': resolvePath('src/router'),
      '@assets': resolvePath('src/assets'),
      '@server': resolvePath('src/server'),
      '@store': resolvePath('src/store'),
      '@mock': resolvePath('src/mock'),
      '@statics': resolvePath('statics')
    },
    symlinks: false,
    cacheWithContext: false,
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.less', '.css', '.styl', '.json']
  }
}
