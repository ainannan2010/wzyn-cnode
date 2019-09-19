import React from 'react';
import Routes from '../config/router';
import AppBar from './layout/app-bar'

export default class App extends React.Component {
  render() {
    return [
      <div key="link">
        <AppBar />
      </div>,
      <div key="route"><Routes /></div>,
    ]
  }
}
