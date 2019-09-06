import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line
// ReactDOM.hydrate(
//   <App />,
//   document.getElementById('root')
// )
const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Component />
    </AppContainer>,
    root,
  )
}
render(App)
if (module.hot) {
  // judge
  module.hot.accept('./App.jsx', () => {
    const NextApp = require('./App.jsx').default // eslint-disable-line
    // ReactDOM.hydrate(
    //   <NextApp />,
    //   root
    // )
    render(NextApp)
  })
}
