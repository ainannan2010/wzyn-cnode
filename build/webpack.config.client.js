const path = require('path')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const isDev = process.env.NODE_ENV === 'development'
const config = webpackMerge(baseConfig, {
  mode: 'development',
  entry: {
    app: path.join(__dirname, '../src/app.js')
  },
  output: {
    filename: '[name].[hash].js'
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../src/template.html')
    }),
    new HTMLPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../src/server.template.ejs'),
      filename: 'server.ejs'
    })
  ]
})

if (isDev) {
  // config.entry = [
  //   'react-hot-laoder/patch',
  //   path.join(__dirname, '../src/app.js')
  // ]
  config.devtool = '#eval-source-map' // 快速定位自己写的代码
  config.devServer = {
    host: '0.0.0.0', // localhost, 127.0.0.1, ip 都可访问，
    port: '8888',
    // contentBase: path.join(__dirname, '../dist'),
    hot: true, // 热更新
    overlay: {
      errors: true
    },
    publicPath: '/public/', // 区分前后端的代码
    historyApiFallback: { // 重定向， 发现不匹配的路由，就跳转到首页
      index: '/public/index.html'
    },
    proxy: {
      '/api': 'http://localhost:3333'
    }
  }

  config.plugins.push(new webpack.HotModuleReplacementPlugin()) // 热更新
}
module.exports = config
