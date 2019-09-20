import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import TopicList from '../views/topic-list/index'
import TopicDetail from '../views/topic-detail/index'
import Login from '../views/user/login'
import UserInfo from '../views/user/info'

export default () => (
  <div>
    <Route path="/" render={() => <Redirect to="/index" />} exact key="index" />
    <Route path="/index" component={TopicList} exact key="index" />
    <Route path="/detail/:id" component={TopicDetail} key="detail" />
    <Route path="/user/login" component={Login} key="login" />
    <Route path="/user/info" component={UserInfo} key="info" />
  </div>
)
