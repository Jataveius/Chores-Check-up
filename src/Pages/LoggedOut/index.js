import React, { Component } from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import Login from '../Login'

class LoggedOut extends Component {

  render() {

    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="*" render={()=><Redirect to="/" />} />
      </Switch>
    )


  }

}

export default withRouter( LoggedOut )
