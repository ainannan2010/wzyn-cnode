const path = require('path')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const NameAllModulesPlugin = require('name-all-modules-plugin');
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const isDev = process.env.NODE_ENV === 'development'
const cdnConfig = require('../app.config').cdn

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
} else {
  config.entry = {
    app: path.join(__dirname, '../src/app.js'),
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'mobx',
      'mobx-react',
      'axios',
      'query-string',
      'dateformat',
      'marked',
    ]
  }
  config.output.filename = '[name].[chunkhash].js'
  config.output.publicPath = cdnConfig.host // 部署到cdn的域名上
  // config.plugins.push(new webpack.HashedModuleIdsPlugin()) // 给包命名的，不再是0，1，2，3，4这样的命名
  config.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: false
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 10,
          enforce: true
        }
      }
    }
  }
  config.plugins.push(
    new NameAllModulesPlugin(),
    new webpack.DefinePlugin({
      'precess.env': {
        NODE_ENV: JSON.stringify('prodution')
      }
    }),
    new webpack.NamedChunksPlugin( chunk => {
      if (chunk.name) {
        return chunk.name
      }
      return chunk.mapModules(m => path.relative(m.context, m.request)).join('_')
    })
  )
}
module.exports = config
