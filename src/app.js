import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import App from './views/App'
import AppState from './store/app-state'
// ReactDOM.hydrate(
//   <App />,
//   document.getElementById('root')
// )
const root = document.getElementById('root')
const initialState = window.__INITIAL__STATE__ || {}
const appState = new AppState(initialState.appState)
const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider appState={appState}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  )
}
render(App)
if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default // eslint-disable-line
    render(NextApp)
  })
}
