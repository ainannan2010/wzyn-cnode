const ejs = require('ejs')
const serialize = require('serialize-javascript')
const bootstrap = require('react-async-bootstrapper') // react 异步请求数据
const ReactDomServer = require('react-dom/server')
const Helmet = require('react-helmet').default // 渲染title，meta等

const getStoreState = stores => Object.keys(stores).reduce((result, storeName) => {
  result[storeName] = stores[storeName].toJson()
  return result
}, {})

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.createStoreMap
    const createApp = bundle.default
    const routerContext = {}
    const stores = createStoreMap()
    const app = createApp(stores, routerContext, req.url) // app 是react元素

    bootstrap(app).then(() => {
      // 如果是请求首页成功定向到/list页
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return
      }

      const helmet = Helmet.rewind()
      const state = getStoreState(stores)
      const content = ReactDomServer.renderToString(app) // content 是把app（react元素）转换为html
      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString()
      })
      res.send(html)
      resolve()
    })
    .catch(reject)
  })
}
