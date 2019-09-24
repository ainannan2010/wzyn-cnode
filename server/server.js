const express = require('express')
// const ReactSSR = require('react-dom/server')
const serverRender = require('./util/server-render')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')
const fs = require('fs') // 负责读写文件
const path = require('path')
const app = express()
// 用了这2个插件， 数据就会被放到req.body上；
app.use(bodyParser.json()) // post请求转换为json格式
app.use(bodyParser.urlencoded({ extended: false })) // post请求——form-data形式

app.use(session({
  maxAge: 10 * 60 * 1000, // 过期时间
  name: 'tid', // 会在浏览器端放置一个cookieId的名称
  resave: false, // 每次提交是否生成一个新的cookieId
  saveUninitialized: false, // 和resave类似
  secret: '!@#¥%&*wzyn' // 加密盐，用来加密cookie，保证cookie在浏览器端不可被解密
}))
app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use('/api/user', require('./util/handle-login')) // 在请求服务端接口之前获取数据
app.use('/api', require('./util/proxy'))

const isDev = process.env.NODE_ENV === 'development'
if (!isDev) {
  const serverEntry = require('../dist/server-entry')
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8')
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res, next) {
    // const appString = ReactSSR.renderToString(serverEntry)
    // res.send(template.replace('<!-- app -->', appString))
    serverRender(serverEntry, template, req, res).catch(next)
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

app.use(function (error, req, res, next) {
  console.log(error);
  res.status(500).send(error)
})

// 默认是0.0.0.0 ，为了安全， 因为部署到外网上会产生一个对外的ip，不希望别人通过ip访问我们的网站，只能通过域名访问
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3333
app.listen(port, host, function () { // host是个可选的参数，不传默认是0.0.0.0
  console.log('server is listening at 3333')
})
