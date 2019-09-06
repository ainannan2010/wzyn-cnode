const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const MemoryFs = require('memory-fs') // 读取内存中的文件
const proxy = require('http-proxy-middleware')
const ReactDomServer = require('react-dom/server')
const serverConfig = require('../../build/webpack.config.server')
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}
const Module = module.constructor
const mfs = new MemoryFs;
const serverCompliler = webpack(serverConfig)
serverCompliler.outputFileSystem = mfs
let serverBundle;
serverCompliler.watch({}, (err, status) => {
  if (err) throw err;
  status = status.toJson();
  status.errors.forEach(err => console.log(err))
  status.warnings.forEach(warn => console.log(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  // 将字符串转化为node可识别的module >> serverBundle
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = new Module();
  m._compile(bundle, 'server-entry.js')
  serverBundle = m.exports.default;
})
module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle)
      res.send(template.replace('<!-- app -->', content))
    })
  })
}
