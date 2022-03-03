'use strict'
const chalk = require('chalk')
const common = require('./webpack.prod')
const webpack = require('webpack')
const request = require('request')

/**
 * webpack 的打包
 */
function webpackBuild () {
  return new Promise((resolve, reject) => {
    webpack(common, (err, stats) => {
      if (err) console.log(err.stack || err)
      else if (stats.hasErrors()) {
        let err = ''
        stats.toString({
          chunks: false,
          colors: true
        }).split(/\r?\n/).forEach(line => {
          err += `    ${line}\n`
        })
        reject(err)
      } else {
        resolve(stats.toString({
          chunks: false,
          colors: true
        }))
      }
    })
  })
}

function versionStr () {
  // const mode = process.env.tag
  // let title = ''
  // switch (mode) {
  //   case 'dev': title = '开发'; break
  //   case 'test': title = '测试'; break
  //   case 'pre': title = '预发'; break
  //   case 'whydemo': title = '演示'; break
  // }
  // return mode + ` version: ${process.env.version}  build:${process.env.build}`
  return process.env.build
}

function getUrl (url) {
  const mode = process.env.tag
  let baseUrl = ''
  switch (mode) {
    case 'dev': baseUrl = 'https://whyt-api.sj56.com.cn/alonsodev'; break
    case 'test': baseUrl = 'https://whyt-api.sj56.com.cn/senna2'; break
    case 'pre': baseUrl = 'https://whyt-api.sj56.com.cn/senna2'; break
    case 'whydemo': baseUrl = 'https://whyt-api.sj56.com.cn/sennademo'; break
    case 'prod': baseUrl = 'https://why-api.sj56.com.cn/senna2/web'; break
  }
  return baseUrl + url
}

// 打包之后版本上传
webpackBuild().then((success) => {
  // 输出打包版本
  const v = versionStr()
  console.log('打包成功！版本：' + v)
  request.get(getUrl('/common/basic/v1/getVerSionNumber?verSionNumber=' + versionStr()), function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('版本号提交成功!')
    }
  })
}).catch((err) => {
  console.warn(err)
})
