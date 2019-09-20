import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Login from '../views/user/login'
import UserInfo from '../views/user/info'
import TopicList from '../views/topic-list'
import TopicDetail from '../views/topic-detail'
import TopicCreate from '../views/topic-create'

export default () => (
  <div>
    <Route path="/" render={() => <Redirect to="/index" />} exact key="index" />
    <Route path="/user/login" component={Login} key="login" />
    <Route path="/user/info" component={UserInfo} key="info" />
    <Route path="/index" component={TopicList} exact key="all" />
    <Route path="/detail/:id" component={TopicDetail} key="detail" />
    <Route path="/topic/create" component={TopicCreate} key="create" />
  </div>
)
