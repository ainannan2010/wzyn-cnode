import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'


import { withStyles, typography } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import ToolBar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import HomeIcon from 'material-ui-icons/Home';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
}

@inject(stores => {
  return {
    appState: stores.appState,
  }
}) @observer
class MainAppBar extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  onHomeIconClick = () => {
    this.context.router.history.push('/index?tab=all')
  }

  createButtonClick = () => {
    this.context.router.history.push('/topic/create')
  }

  loginButtonClick = () => {
    if (this.props.appState.user.info.isLogin) {
      this.context.router.history.push('/user/info')
    } else {
      this.context.router.history.push('/user/login')
    }
  }

  render() {
    const { classes } = this.props
    const { user } = this.props.appState;
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <ToolBar>
            <IconButton color="inherit" onClick={this.onHomeIconClick}>
              <HomeIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              Wzyn-cnode
            </Typography>
            <Button
              variant="flat"
              color="inherit"
              onClick={this.createButtonClick}
            >
              Create Topic
            </Button>
            <Button color="inherit" variant="raised" onClick={this.loginButtonClick}>
              {
                user && user.isLogin ? user.info.loginname : 'Login'
              }
            </Button>
          </ToolBar>
        </AppBar>
      </div>
    )
  }
}

MainAppBar.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
}

MainAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MainAppBar)
