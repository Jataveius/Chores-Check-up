import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Login from '../Login'

class LoggedOut extends Component {

  render() {

    return (
      <Switch>
        <Route exact path="/" component={Login} />
      </Switch>
    )


  }

}

export default withRouter( LoggedOut )
