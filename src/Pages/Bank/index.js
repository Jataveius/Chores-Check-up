import React, { Component } from 'react'
import moment from 'moment'
import { getUserBanks } from '../../utils/_data'
import piggybank from '../../assets/images/piggybank.png'

class Bank extends Component {
  state = {
    currentUser: {}
  }

  componentWillMount() {
    const currentUser = (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) || {};
    if(currentUser && currentUser._id) {
      this.setState({
        currentUser,
        banks: [],
      })
      this.getBanks(currentUser.username);
    }
  }

  getBanks = async (username) => {
    const res = await getUserBanks(username);
    const that = this;
    if(res && res.length) {
      this.setState({
        banks: res,
      }, () => {
        that.calcBalance();
      })
    }
  }

  calcBalance = () => {
    const { banks } = this.state;
    let balance = 0;
    banks.forEach((bank) => {
      if (bank.transaction === 'deposit') {
        balance = balance + parseInt(bank.amount, 10);
      } else {
        balance = balance - parseInt(bank.amount, 10);
      }
    })
    this.setState({
      balance
    })
  }

  render() {
    const { currentUser, banks, balance } = this.state;
    return (
      <div className="container bankbackground">
        <div className="col-md-12" id="bank"  style={{display: 'inline-block', marginTop: 70 }}>
          <img src={piggybank} className="icons" alt="piggy-bank"/><p className="lead"><b>{currentUser.firstname}'s account at the Mom Bank</b></p>
        </div>
        <table id="kidbanktable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Deposit</th>
              <th>Withdrawal</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {
              banks && banks.length ? banks.map((bank, i) => {
                const unix = moment(bank.date).unix();
                const date = moment.unix(unix).format('MM-DD-YYYY')
                return (
                  <tr key={i}>
                    <td>{date}</td>
                    <td>{bank.transaction === 'deposit' && <span>${bank.amount}.00</span>}</td>
                    <td>{bank.transaction === 'withdrawal' && <span>${bank.amount}.00</span>}</td>
                    <td>{bank.comment}</td>
                  </tr>
                )
              }): null
            }
            <tr>
              <td>Account Balance</td>
              <td colSpan={3}>${balance}.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

}

export default Bank