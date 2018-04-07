import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../../utils/_data'

class Header extends Component {

  onLogout = async () => {
    const status = await logout();
    if(status) {
      window.location.href = '/'
    }
  }

  render() {

    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div>
          <div className="navbar-header">
            <a className="navbar-brand" href="/admin">Welcome to Chores Check Up!</a>
          </div>
          <ul className="nav navbar-nav">
            <li className="nav-item"><Link to="/home">Admin Home</Link></li>
            <li className="nav-item active"><Link to="/transaction">Mom Bank</Link></li>
            <li className="nav-item"><Link to="/rewards">Bonus Rewards</Link></li>
          </ul>
          <button className="btn btn-default navbarbutton" onClick={this.onLogout}>Log Out</button>
        </div>
      </nav>
    )
  }

}

export default Header
