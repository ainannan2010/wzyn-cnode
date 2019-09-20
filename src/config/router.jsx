import React, { Component } from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import Login from '../views/user/login'
import UserInfo from '../views/user/info'
import TopicList from '../views/topic-list'
import TopicDetail from '../views/topic-detail'
import TopicCreate from '../views/topic-create'

const PrivateRoute = ({ isLogin, component: WrapComponent, ...rest }) => (
  <Route
    {...rest}
    render={
      props => (
        isLogin ?
          <WrapComponent {...props} /> :
          <Redirect
            to={{
              pathname: '/user/login',
              search: `?from=${rest.path}`,
            }}
          />
      )
    }
  />
)
// withRouter为了解决react-router-dom和mbox关于shouldComponentUpdate的冲突
const InjectedPrivateRoute = withRouter(inject(stores => {
  return {
    isLogin: stores.appState.user.isLogin,
  }
})(observer(PrivateRoute)))

PrivateRoute.propTypes = {
  isLogin: PropTypes.bool,
  component: PropTypes.element.isRequired,
}

PrivateRoute.defaultProps = {
  isLogin: false,
}

export default () => (
  <div>
    <Route path="/" render={() => <Redirect to="/index" />} exact />
    <Route path="/user/login" component={Login} />
    <Route path="/user/info" component={UserInfo} />
    <Route path="/index" component={TopicList} />
    <InjectedPrivateRoute path="/detail/:id" component={TopicDetail} />
    <InjectedPrivateRoute path="/topic/create" component={TopicCreate} />
  </div>
)
