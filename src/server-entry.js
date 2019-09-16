import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'
import App from './views/App'
import { createStoreMap } from './store/store'
// 让mobx在服务端渲染的时候不会重复的调用computed，导致数据变化，内存溢出
useStaticRendering(true)
// stores 是很多的store， context处理某些事件的过程中返回的一些参数，来提供使用,location是当前请求的的url
export default (stores, routerContext, url) => {
  return (
    <Provider {...stores}>
      <StaticRouter
        context={routerContext}
        location={url}
      >
        <App />
      </StaticRouter>
    </Provider>
  )
}

export { createStoreMap }
