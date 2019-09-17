import React from 'react'
import ReactDom from 'react-dom'
import SendBox from './SendBox';

export default class TopicDetail extends React.Component {
  render() {
    return (
      <div>
        <p>This is topic detail</p>
        <SendBox />
      </div>
    )
  }
}
