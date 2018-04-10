import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../../utils/_data'

class Header extends Component {

  state = {
    admin: false,
  }

  componentWillMount() {
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    if(user && user.admin) {
      this.setState({
        admin: user.admin
      })
    }
  }

  onLogout = async () => {
    const status = await logout();
    if(status) {
      window.location.href = '/'
    }
  }

  render() {
    const route = window.location.href;
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        {
          this.state.admin ?
            <div>
              <div className="navbar-header">
                <Link className="navbar-brand" to="/home">Welcome to Chores Check Up!</Link>
              </div>
              <ul className="nav navbar-nav">
                <li className={`nav-item ${route === '/transaction' && 'active'}`}><Link to="/home">Admin Home</Link></li>
                <li className={`nav-item ${route === '/transaction' && 'active'}`} ><Link to="/transaction">Mom Bank</Link></li>
                <li className={`nav-item ${route === '/transaction' && 'active'}`}><Link to="/rewards">Bonus Rewards</Link></li>
              </ul>
              <button className="btn btn-default navbarbutton" onClick={this.onLogout}>Log Out</button>
            </div>
          :
            <div>
              <div className="navbar-header">
                <Link className="navbar-brand" to="/user">Welcome to Chores Check Up!</Link>
              </div>
              <ul className="nav navbar-nav">
                <li className={`nav-item ${route === '/user' && 'active'}`}><Link to="/user">Home</Link></li>
                <li className={`nav-item ${route === '/checklist' && 'active'}`}><Link to="/checklist">My To-Do List</Link></li>
                <li className={`nav-item ${route === '/userbooklog' && 'active'}`}><Link to="/userbooklog">Book Log</Link></li>
                <li className={`nav-item ${route === '/bank' && 'active'}`}><Link to="/bank">Mom Bank</Link></li>
                <li className={`nav-item ${route === '/user' && 'active'}`}><Link to="/funstuff">Fun Stuff</Link></li>
              </ul>
              <button className="btn btn-default navbarbutton" onClick={this.onLogout}>Log Out</button>
            </div>
        }
      </nav>
    )
  }

}

export default Header
