const ejs = require('ejs')
const serialize = require('serialize-javascript')
const bootstrap = require('react-async-bootstrapper') // react 异步请求数据
const ReactDomServer = require('react-dom/server')
const Helmet = require('react-helmet').default // 渲染title，meta等

const SheetsRegitry = require('react-jss').SheetsRegistry
const create = require('jss').create
const preset = require('jss-preset-default').default
const createMuiTheme = require('material-ui/styles').createMuiTheme
const createGenerateClassName = require('material-ui/styles').createGenerateClassName
const colors = require('material-ui/colors')

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
    const sheetsRegistry = new SheetsRegitry()
    // const jss = create(preset())
    // jss.options.createGenerateClassName = createGenerateClassName
    const generateClassName = createGenerateClassName()
    const theme = createMuiTheme({
      palette: {
        primary: colors.blue,
        secondary: colors.pink,
        type: 'light'
      }
    })

    const app = createApp(stores, routerContext, sheetsRegistry, generateClassName, theme, req.url) // app 是react元素类型

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
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString()
      })
      res.send(html)
      resolve()
    })
      .catch(reject)
  })
}
