import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../../utils/_data'
import PropTypes from 'prop-types'

class Header extends Component {
  static propTypes = {
    history: PropTypes.object,
  }

  state = {
    admin: false,
  }

  componentWillMount() {
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
    let admin = false;
    if(user && user.admin) {
      admin= user.admin
    }
    this.setState({
      admin,
      route: window.location.pathname,
    })
  }

  onLogout = async () => {
    const status = await logout();
    if(status) {
      window.location.href = '/'
    }
  }

  onRoute = (route) => {
    this.setState({
      route
    })
  }

  render() {
    const { route } = this.state;
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        {
          this.state.admin ?
            <div>
              <div className="navbar-header">
                <Link className="navbar-brand" to="/home">Welcome to Chores Check Up!</Link>
              </div>
              <ul className="nav navbar-nav">
                <li className={`nav-item ${route === '/admin' && 'active'}`}><Link to={"/admin"} onClick={() => this.onRoute('/home')}>Admin Home</Link></li>
                <li className={`nav-item ${route === '/transaction' && 'active'}`} ><Link to={"/transaction"} onClick={() => this.onRoute('/transaction')}>Mom Bank</Link></li>
                <li className={`nav-item ${route === '/rewards' && 'active'}`}><Link to={"/rewards"} onClick={() => this.onRoute('/rewards')}>Bonus Rewards</Link></li>
              </ul>
              <button className="btn btn-default navbarbutton" onClick={this.onLogout}>Log Out</button>
            </div>
          :
            <div>
              <div className="navbar-header">
                <Link className="navbar-brand" to="/user">Welcome to Chores Check Up!</Link>
              </div>
              <ul className="nav navbar-nav">
                <li className={`nav-item ${route === '/user' && 'active'}`}><Link to={`/user`} onClick={() => this.onRoute('/user')}>Home</Link></li>
                <li className={`nav-item ${route === '/todolist' && 'active'}`}><Link to={"/todolist"} onClick={() => this.onRoute('/todolist')}>My To-Do List</Link></li>
                <li className={`nav-item ${route === '/booklog' && 'active'}`}><Link to={"/booklog"} onClick={() => this.onRoute('/booklog')}>Book Log</Link></li>
                <li className={`nav-item ${route === '/bank' && 'active'}`}><Link to={"/bank"} onClick={() => this.onRoute('/bank')}>Mom Bank</Link></li>
                <li className={`nav-item ${route === '/funstuff' && 'active'}`}><Link to={"/funstuff"} onClick={() => this.onRoute('/funstuff')}>Fun Stuff</Link></li>
              </ul>
              <button className="btn btn-default navbarbutton" onClick={this.onLogout}>Log Out</button>
            </div>
        }
      </nav>
    )
  }

}

export default Header
