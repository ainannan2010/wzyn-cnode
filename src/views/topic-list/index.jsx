import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import queryString from 'query-string'

import Tabs, { Tab } from 'material-ui/Tabs'
import List from 'material-ui/List'
import Button from 'material-ui/Button'
import { CircularProgress } from 'material-ui/Progress'

import AppState from '../../store/app-state'
import Container from '../layout/container'
import TopicListItem from './list-item'
import { tabs } from '../../util/variable-define'

@inject(stores => {
  return {
    appState: stores.appState,
    topicStore: stores.topicStore,
  }
}) @observer
class TopicList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  componentDidMount() {
    const tab = this.getTab()
    this.props.topicStore.fetchTopics(tab)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search))
    }
  }

  changeTab = (e, value) => {
    this.context.router.history.push({
      path: '/index',
      search: `?tab=${value}`,
    })
  }

  getTab = (search) => {
    const searchString = search || this.props.location.search;
    const query = queryString.parse(searchString);
    return query.tab || 'all'
  }

  listItemClick = (topic) => {
    this.context.router.history.push(`./detail/${topic.id}`)
  }

  bootstrap() {
    const query = queryString.parse(this.props.location.search);
    const tab = query.tab || 'all';
    const result = this.props.topicStore.fetchTopics(tab).then(() => {
      return true;
    }).catch(() => {
      return false;
    });
    return result;
  }

  render() {
    const {
      topicStore,
      appState,
    } = this.props
    const { createdTopics = [], topics: topicList, syncing: topicSyncing } = topicStore
    const tab = this.getTab()
    const { user } = appState
    return (
      <Container>
        <Helmet>
          <title>this is topic list</title>
          <meta name="descripion" content="this is topic list" />
        </Helmet>
        <Tabs value={tab} onChange={this.changeTab}>
          {
            Object.keys(tabs).map(tabKey => (
              <Tab label={tabs[tabKey]} value={tabKey} key={tabKey} />
            ))
          }
        </Tabs>
        <List style={{ backgroundColor: '#dfdfdf' }}>
          {
            createdTopics.map((topic) => {
              topic = Object.assign({}, topic, {
                author: user.info,
              })

              return (
                <TopicListItem
                  key={topic.id}
                  topic={topic}
                  onClick={() => this.listItemClick(topic)}
                />
              )
            })
          }
        </List>
        <List>
          {
            topicList.map((topic) => (
              <TopicListItem
                onClick={() => this.listItemClick(topic)}
                topic={topic}
                key={topic.id}
              />
            ))
          }
        </List>
        {
          topicSyncing ?
            (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <CircularProgress color="primary" size={100} />
              </div>
            ) :
            null
        }

      </Container>

    )
  }
}

TopicList.wrappedComponent.propTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired,
  topicStore: PropTypes.object.isRequired,
}

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
}

export default TopicList
