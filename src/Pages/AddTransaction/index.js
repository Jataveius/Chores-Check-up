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
          counter = counter + parseInt(bank.amount, 10);
        } else {
          if (user.username === bank.username && bank.transaction === 'withdrawal') {
            counter = counter - parseInt(bank.amount, 10);
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
        await delBankTransaction(transactionId);
        that.getTransactions();
      });
  }

  onEditable = (i) => {
    let {transactionsList} = this.state
      transactionsList = transactionsList.map((obj, i1) =>{
            if(i === i1){
                return{
                    ...obj,
                    editable1: true,
                }
            }
            return obj;
      });
    this.setState({
        transactionsList
    })
  }

  onTextChange = (e,i) =>{
    let {transactionsList} = this.state;
    transactionsList = transactionsList.map((obj, i1)=>{
        if(i === i1){
          return{
              ...obj,
              [e.target.name]: e.target.value,
          }
        }
        return obj;
    });

    this.setState({
        transactionsList
    })
  }

  onEditableCancel = (i) => {
    let {transactionsList,allTransactions} = this.state;
    transactionsList[i].editable1 = false;
    if(transactionsList[i]._id) {
      const editRow = allTransactions.filter(t => t._id === transactionsList[i]._id);
      transactionsList[i] = editRow[0]
    }
    this.setState({
      transactionsList
    })
  }

  updateTransaction = async (transaction) => {
    let {transactionsList} = this.state;
      if(transaction && transaction.date && transaction.transaction && transaction.amount && transaction.username && transaction.comment) {
          const data = {
              date:transaction.date,
              transaction: transaction.transaction,
              amount:transaction.amount,
              username:transaction.username,
              comment:transaction.comment
          }

          if(transaction._id) {
              data._id = transaction._id;
              await updateBankTransaction(data);
          }

          const res = await getBankTransactions();
          if(res && res.data && res.data.length) {
              transactionsList = transactionsList.map((t) => {
                  if(t._id) {
                      if(t._id === transaction._id)
                      {
                          return {
                              ...t,
                              editable1: false,
                          }
                      }
                  }
                  return t;
              });
              this.setState({
                  allTransactions: res.data,
                  transactionsList
              })
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
        const unix = moment(t.date).unix();
        const date = moment.unix(unix).format('MM-DD-YYYY')
        return t.transaction.toString().search(e.target.value) !== -1 || date.toString().search(e.target.value) !== -1
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
    const { currentUser, balance, users, date, transaction, amount, username, comment, searchText, transactionsList } = this.state;
    return (
      <div className="container" style={{marginTop: 85, padding:0}}>
          <div className="panel panel-default">
            <div className="panel-heading"><b>MAKE A TRANSACTION AT THE MOM BANK</b></div>
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
                    <button type="submit" className="btn  btn-primary" style={{float: 'right', marginTop: '7%'}}>Submit</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group" style={{marginLeft: '-4%'}}>
              <div className="input-group">
                <div className="input-group-addon"><i className="fa fa-search" /></div>
                <input type="text" className="form-control" name="searchText" placeholder="Search" value={searchText} onChange={this.onSearch} />
              </div>
            </div>
          </div>
          <div>
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
                    const editDate = moment.unix(unix).format('YYYY-MM-DD')

                      return (
                        <tr key={i}>
                          <td>
                            {
                                transaction.editable1 ?
                                <input className="form-control" type="date" name="date" value={editDate} onChange={(e) => this.onTextChange(e, i)} required />
                              : <span className="editable">{date}</span>
                            }
                          </td>
                          <td>
                            {
                                transaction.editable1 ?
                                <select className="form-control" name="transaction" value={transaction.transaction} onChange={(e) => this.onTextChange(e, i)} required>
                                  <option value="">Select type</option>
                                  <option value="deposit">deposit</option>
                                  <option value="withdrawal">withdrawal</option>
                                </select>
                                : <span className="editable">{transaction.transaction}</span>
                            }
                          </td>
                          <td>
                            {
                                transaction.editable1 ?
                                <input className="form-control" type="number" name="amount" value={transaction.amount} min="0" max="100" onChange={(e) => this.onTextChange(e, i)} required />
                              : <span className="editable">{transaction.amount}</span>
                            }
                          </td>
                          <td>
                            {
                                transaction.editable1 ?
                                <select className="form-control" name="username" value={transaction.username} onChange={(e) => this.onTextChange(e, i)} required >
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
                                transaction.editable1 ?
                                <input className="form-control" type="text" name="comment" value={transaction.comment} onChange={(e) => this.onTextChange(e, i)} />
                              : <span className="editable">{transaction.comment}</span>
                            }
                          </td>
                          <td className="text-center">
                            {
                                transaction.editable1 ?
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
            <table style={{width: "100%"}}>
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
