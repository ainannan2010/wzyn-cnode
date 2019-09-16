import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import AppState from '../../store/app-state'

@inject('appState') @observer
class TopicList extends React.Component {
  // static propTypes = {
  //   appState: PropTypes.object.isRequired,
  // }
  handleChange = (event) => {
    this.props.appState.changeName(event.target.value);
  }

  bootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3
        resolve(true)
      });
    })
  }

  render() {
    const { msg } = this.props.appState
    return (
      <div>
        <Helmet>
          <title>this is topic list</title>
          <meta name="descripion" content="this is topic list" />
        </Helmet>

        <input onChange={(e) => this.handleChange(e)} />
        <span>{msg}</span>
      </div>

    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
}
export default TopicList
