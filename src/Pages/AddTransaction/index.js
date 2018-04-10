import React, { Component } from 'react'
import moment from 'moment'
import swal from 'bootstrap-sweetalert'
import {
  getBankTransactions,
  addBankTransaction,
  delBankTransaction,
  getUsers,
  updateBankTransaction
} from '../../utils/_data'

class AddTransaction extends Component {
  state = {
    date: '',
    transaction: '',
    amount: '',
    username: '',
    comment: '',
    searchText: '',
    error: '',
    transactionsList: [],
    allTransactions: [],
    users: [],
    balance: [],
    editableIndex: '',
    currentUser: {} ,
    editDate: '',
    editTransaction: '',
    editComment: '',
    editUsername: '',
    editAmount: '',
    editTransactionId: '',
  }

  componentWillMount() {
    const currentUser = (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) || {};
    if(currentUser && currentUser._id) {
      this.setState({
        currentUser
      })
    }
    this.getTransactions()
    this.getUsername()
  }

  getTransactions = async () => {
    const res = await getBankTransactions();
    if(res && res.data && res.data.length) {
      this.setState({
        transactionsList: res.data,
        allTransactions: res.data
      })
    }
  }

  checkBalance = () => {
    const { allTransactions, users } = this.state
    let balance = [];
    users.forEach((user) => {
      let counter = 0;
      allTransactions.forEach((bank) => {
        if(user.username === bank.username && bank.transaction === 'deposit') {
          counter = counter + parseInt(bank.amount);
        } else {
          if (user.username === bank.username && bank.transaction === 'withdrawal') {
            counter = counter - parseInt(bank.amount);
          }
        }
      })
      let userBalance = {
        username: user.username,
        balance: counter
      };
      balance.push(userBalance);
    })
    this.setState({
      balance
    })
  }

  getUsername = async () => {
    const res = await getUsers();
    if(res && res.data && res.data.length) {
      this.setState({
        users: res.data
      }, () => {
        this.checkBalance()
      })
    }
  }

  removeTransaction = (transactionId) => {
    const that = this;
    swal({
        title: "Are you sure?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
      },
      async function(){
        swal("Deleted!", "Your imaginary file has been deleted.", "success");
        const res = await delBankTransaction(transactionId);
        that.getTransactions();
      });
  }

  onEditable = (i, transaction) => {
    const unix = moment(transaction.date).unix();
    const editDate = moment.unix(unix).format('YYYY-MM-DD')
    this.setState({
      editableIndex: i,
      editDate: editDate,
      editTransaction: transaction.transaction,
      editComment: transaction.comment,
      editUsername: transaction.username,
      editAmount: transaction.amount,
      editTransactionId: transaction._id,
    })
  }

  onEditableCancel = () => {
    this.setState({
      editableIndex: ''
    })
  }

  updateTransaction = async () => {
    const { editTransactionId, editDate, editTransaction, editComment, editUsername, editAmount } = this.state;
    const data = {
      date: editDate,
      transaction: editTransaction,
      amount: editAmount,
      username: editUsername,
      comment: editComment,
      _id: editTransactionId
    }
    if( editDate && editTransaction && editUsername, editAmount) {
      const res = await updateBankTransaction(data);
      if(res) {
        this.setState({
          editDate: '',
          editTransaction: '',
          editComment: '',
          editUsername: '',
          editAmount: '',
          editableIndex: '',
        });
        this.getTransactions()
      }
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit =  async (event) => {
    event.preventDefault();
    let { error, date, transaction, amount, username, comment } = this.state;
    const data = {
      date,
      transaction,
      amount,
      username,
      comment,
    }
    const res = await addBankTransaction(data);
    if(res.status === 'error') {
      error = res.message;
      return this.setState({ error })
    }
    this.setState({
      error,
      date: '',
      transaction: '',
      amount: '',
      username: '',
      comment: '',
    })
    this.getTransactions();
  }

  onSearch = (e) => {
    let { allTransactions, transactionsList } = this.state;
    if(e.target.value) {
      transactionsList = allTransactions.filter((t) => {
        return t.transaction.toString().search(e.target.value) !== -1 || t.date.toString().search(e.target.value) !== -1
          || t.amount.toString().search(e.target.value) !== -1 || t.username.toString().search(e.target.value) !== -1
          || t.comment.toString().search(e.target.value) !== -1
      })
    } else {
      transactionsList = allTransactions
    }
    this.setState({
      transactionsList,
      [e.target.name]: e.target.value
    })
  }

  render() {
    const { currentUser, balance, users, date, transaction, amount, username, comment, searchText, transactionsList, editableIndex, editDate, editTransaction, editComment, editAmount, editUsername } = this.state;
    return (
      <div>
        <div className="panel-body">
          <div id="banktransaction" className="panel panel-default">
            <div className="panel-heading" style={{marginTop: '8vh'}}><b>MAKE A TRANSACTION AT THE MOM BANK</b></div>
            <div className="panel-body">
              <form onSubmit={this.onSubmit}>
                <div className="form-group row">
                  <div className="col-md-3">
                    <label>Select transaction date:</label>
                    <input className="form-control" type="date" name="date" value={date} onChange={this.onChange} required />
                  </div>
                  <div className="col-md-3">
                    <label> Select transaction type: </label>
                    <select className="form-control" name="transaction" value={transaction} onChange={this.onChange} required>
                      <option value="">Select type</option>
                      <option value="deposit">deposit</option>
                      <option value="withdrawal">withdrawal</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label>Amount:  </label>
                    <input className="form-control" type="number" name="amount" value={amount} min="0" max="100" onChange={this.onChange} required />
                  </div>
                  <div className="col-md-3">
                    <label> Select child: </label>
                    <select className="form-control" name="username" value={username} onChange={this.onChange} required >
                      <option value="">Select child</option>
                      {
                        users.map((user) => {
                          return currentUser && currentUser._id !== user._id && <option key={user._id} value={user.username}>{user.username}</option>
                        })
                      }
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-8">
                    <label> Comments: </label>
                    <input className="form-control" type="text" name="comment" value={comment} onChange={this.onChange} />
                  </div>
                  <div className="col-md-4">
                    <button type="submit" className="btn  btn-primary" style={{float: 'right', marginRight: '5vw', marginTop: '4vh'}}>Submit</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group" style={{marginLeft: '3vw'}}>
              <div className="input-group">
                <div className="input-group-addon"><i className="fa fa-search" /></div>
                <input type="text" className="form-control" name="searchText" placeholder="Search" value={searchText} onChange={this.onSearch} />
              </div>
            </div>
          </div>
          <div id="admintable">
            <table className="table table-bordered table-hover table-condensed" >
              <thead>
                <tr style={{fontWeight: 'bold'}}>
                  <td style={{width:'15%'}}>Date</td>
                  <td style={{width:'15%'}}>Transaction</td>
                  <td style={{width:'10%'}}>Amount</td>
                  <td style={{width:'20%'}}>Name</td>
                  <td style={{width:'25%'}}>Comment</td>
                  <td style={{width:'25%'}}>Edit</td>
                </tr>
              </thead>
              <tbody>
                {
                  transactionsList.map((transaction, i) => {
                      const unix = moment(transaction.date).unix();
                      const date = moment.unix(unix).format('MM-DD-YYYY')
                      return (
                        <tr key={i}>
                          <td>
                            {
                              editableIndex === i ?
                                <input className="form-control" type="date" name="editDate" value={editDate} onChange={this.onChange} required />
                              : <span className="editable">{date}</span>
                            }
                          </td>
                          <td>
                            {
                              editableIndex === i ?
                                <select className="form-control" name="editTransaction" value={editTransaction} onChange={this.onChange} required>
                                  <option value="">Select type</option>
                                  <option value="deposit">deposit</option>
                                  <option value="withdrawal">withdrawal</option>
                                </select>
                                : <span className="editable">{transaction.transaction}</span>
                            }
                          </td>
                          <td>
                            {
                              editableIndex === i ?
                                <input className="form-control" type="number" name="editAmount" value={editAmount} min="0" max="100" onChange={this.onChange} required />
                              : <span className="editable">{transaction.amount}</span>
                            }
                          </td>
                          <td>
                            {
                              editableIndex === i ?
                                <select className="form-control" name="editUsername" value={editUsername} onChange={this.onChange} required >
                                  <option value="">Select child</option>
                                  {
                                    users.map((user) => {
                                      return currentUser && currentUser._id !== user._id && <option key={user._id} value={user.username}>{user.username}</option>
                                    })
                                  }
                                </select>
                              : <span className="editable">{transaction.username}</span>
                            }
                          </td>
                          <td>
                            {
                              editableIndex === i ?
                                <input className="form-control" type="text" name="editComment" value={editComment} onChange={this.onChange} />
                              : <span className="editable">{transaction.comment}</span>
                            }
                          </td>
                          <td className="text-center">
                            {editableIndex === i ?
                              <div className="buttons" >
                                <button type="button"  style={{display: 'inline-block'}} className="btn btn-primary" onClick={this.updateTransaction}>
                                  save
                                </button>
                                <button type="button"  style={{display: 'inline-block'}} className="btn btn-default ml-3" onClick={this.onEditableCancel}>
                                  cancel
                                </button>
                              </div>
                              :
                              <div className="buttons">
                                <button type="button" className="btn btn-primary" onClick={() => this.onEditable(i, transaction)}>edit</button>
                                <button type="button" className="btn btn-danger" onClick={() => this.removeTransaction(transaction._id)} >del</button>
                              </div>
                            }
                          </td>
                        </tr>
                      )
                  })
                }
              </tbody>
            </table>
          </div>
          <table id="balancestable">
            <thead>
              <tr>
                <th colSpan={2}>Account Balances</th>
              </tr>
              <tr>
                <th>Name</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
            {
              balance.map((b) => {
                return currentUser && currentUser.username !== b.username &&
                  <tr key={b.username} >
                    <td><span>{b.username}</span></td>
                    <td>{`$${b.balance && b.balance}.00`}</td>
                  </tr>
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    )

  }

}

export default AddTransaction
