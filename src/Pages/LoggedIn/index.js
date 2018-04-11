import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import utils from '../../utils'
import AddTransaction from '../AddTransaction'
import AdminHome from '../AdminHome'
import Reward from '../Reward'
import Header from '../Common/Header'
import BookLog from '../BookLog'
import User from '../User'
import MyTodoList from '../MyTodoList'
import FunStuff from '../FunStuff'
import Bank from '../Bank'

class LoggedIn extends Component {

  static propTypes = {
    history: PropTypes.object,
  }

  state = {
    admin: false
  }

  componentWillMount() {

    const userId = utils.getCookie( 'userId' );
    const auth = utils.getCookie( 'auth' );
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));

    if ( !userId || !auth ) {
      this.props.history.push( {
        pathname: '/',
      } )

    }

    if(user && user.admin) {
      this.setState({
        admin: user.admin
      })
    }

  }


  render() {

    return (
      <div>
        <Header />
        {
          this.state.admin ?
          <Switch>
            <Route exact path="/admin" component={AdminHome}/>
            <Route exact path="/rewards" component={Reward} />
            <Route exact path="/transaction" component={AddTransaction} />
            <Route path="*" render={()=><Redirect to="/admin" />} />
          </Switch>
          :
          <Switch>
            <Route exact path="/booklog" component={BookLog} />
            <Route exact path="/todolist" component={MyTodoList} />
            <Route exact path="/user" component={User} />
            <Route exact path="/bank" component={Bank} />
            <Route exact path="/funstuff" component={FunStuff} />
            <Route path="*" render={()=><Redirect to="/user" />} />
          </Switch>
        }
      </div>
    )

  }

}

export default withRouter( LoggedIn )
