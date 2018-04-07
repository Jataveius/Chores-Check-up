import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, withRouter } from 'react-router-dom'
import utils from '../../utils'
import AddTransaction from '../AddTransaction'
import Header from '../Common/Header'

class LoggedIn extends Component {

  static propTypes = {
    history: PropTypes.object,
  }

  componentWillMount() {

    const userId = utils.getCookie( 'userId' )
    const auth = utils.getCookie( 'auth' )

    if ( !userId || !auth ) {

      this.props.history.push( {
        pathname: '/',
      } )

    }

  }


  render() {

    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/transaction" component={AddTransaction} />
          <Route path="/" component={AddTransaction} />
        </Switch>
      </div>
    )

  }

}

export default withRouter( LoggedIn )
