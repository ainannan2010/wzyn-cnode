const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const MemoryFs = require('memory-fs') // 读取内存中的文件
const proxy = require('http-proxy-middleware')
const serverConfig = require('../../build/webpack.config.server')
const serverRender = require('./server-render')

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const NativeModule = require('module')
const vm = require('vm')

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}
const mfs = new MemoryFs()
serverConfig.mode = 'development'
const serverCompliler = webpack(serverConfig)
serverCompliler.outputFileSystem = mfs
let serverBundle
serverCompliler.watch({}, (err, status) => {
  if (err) throw err
  status = status.toJson()
  status.errors.forEach(err => console.log(err))
  status.warnings.forEach(warn => console.log(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  // 将字符串转化为node可识别的module >> serverBundle
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports
})

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  app.get('*', function (req, res, next) {
    if (!serverConfig) {
      return res.send('waiting for compile, refresh later')
    }
    getTemplate().then(template => { // template 是请求回来的html字符串
      return serverRender(serverBundle, template, req, res)
    }).catch(next)
  })
}
