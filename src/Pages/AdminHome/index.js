import React, {Component} from 'react'
import swal from 'bootstrap-sweetalert'
import {
  getTasks,
  getUsers,
  removeUsers,
  addUser,
  addTask,
  resetTask,
  delTask,
  updateTask
} from '../../utils/_data'

const table = {
  'border': '1px solid grey',
  'marginLeft': 17,
  'width': 1100,
  'margin': '1vw'
};

class AdminHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      taskShow: true,
      rows: ['row 1'],
      firstname: '',
      lastname: '',
      username: '',
      admin: '',
      allowance: '',
      password: '',
      calendar: '',
      editableIndex: '',
      users: [],
      tasks: [],
      allTasks: [],
      currentUser: {},
      description: '',
      frequency: '',
      taskUser: '',
      searchText: '',
      frequencies: [1,2,3,4,5,6,7]
    };
  }

  componentWillMount() {
    const currentUser = (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) || {};
    if(currentUser && currentUser._id) {
      this.setState({
        currentUser
      })
    }
    this.getTask();
    this.getUsername()
  }

  getTask = async () => {
    const res = await getTasks();
    if(res && res.data && res.data.length) {
      this.setState({
        tasks: res.data,
        allTasks: res.data,
      })
    }
  }

  getUsername = async () => {
    const res = await getUsers();
    if(res && res.data && res.data.length) {
      this.setState({
        users: res.data
      })
    }
  }

  isShowTable = () => {
    const {isShow} = this.state;
    this.setState({isShow: !isShow});
  }

  handleTask = () => {
    this.setState({
      taskShow: !this.state.taskShow
    });
  }

  onSearch = (e) => {
    let { allTasks, tasks } = this.state;
    if(e.target.value) {
      tasks = allTasks.filter((t) => {
        return t.description.toString().search(e.target.value) !== -1 || t.frequency.toString().search(e.target.value) !== -1
          || t.username.toString().search(e.target.value) !== -1
      })
    } else {
      tasks = allTasks
    }
    this.setState({
      tasks,
      [e.target.name]: e.target.value
    })
  }

  onSubmit = async (event) => {
    event.preventDefault();
    let {  admin, firstname, calendar, lastname, username, password, allowance, } = this.state;
    const data = {
      username,
      lastname,
      calendar: false,
      firstname,
      admin,
      password,
      allowance,
    }
    const res = await addUser(data);
    this.setState({
      firstname: '',
      lastname: '',
      username: '',
      admin: '',
      allowance: '',
      password: '',
      calendar: '',
    })
    this.getUsername();
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  showUsername = (task) => {
    const { users } = this.state
    if(task.username && users.length) {
      //check to see if vm.username contains task.username
      let selected = users.filter(u => u.username === task.username );
      return selected.length ? selected[0].username : 'Not set';
    } else {
      return task.username || 'Not set';
    }
  };

  showFrequency = function(task) {
    const { frequencies } = this.state
    let selected = [];
    if(task.frequency) {
      selected = frequencies.filter(f => f === parseInt(task.frequency));
    }
    return selected.length ? selected[0] : 'Not set';
  };

  addRow = () => {
    const { tasks } = this.state
    const inserted = {
      id: tasks.length+1,
      description: '',
      frequency: '',
      username: '',
      isNew: true,
      editable: true,
    };
    tasks.push(inserted);
    this.setState({
      tasks
    })
  }

  removeTask = (i, transactionId) => {
    const { tasks } = this.state
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
        if (transactionId) {
          const res = await delTask(transactionId);
        }
        tasks.splice(i, 1)
        that.setState({
          tasks
        })
      });
  }

  onEditable = (i) => {
    let { tasks } = this.state;

    tasks = tasks.map((p, i1) => {
      if(i === i1) {
        return {
          ...p,
          editable: true,
          isNew: true,
        }
      }
      return p;
    });

    this.setState({
      tasks
    })
  }

  onEditableCancel = (i) => {
    let { tasks, allTasks } = this.state;
    tasks[i].editable = false;
    if(tasks[i]._id) {
      const editRow = allTasks.filter(t => t._id === tasks[i]._id);
      tasks[i] = editRow[0]
    } else {
      tasks[i].isNew = false;
    }
    this.setState({
      tasks
    })
  }

  removeUser = (userId) => {
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
        swal("Deleted!", "User Removed Successfully.", "success");
        const res = await removeUsers(userId);
        that.getUsername();
      });
  }

  resetUser = (username) => {
    const resetAllObj = {
      username: username,
      count: 0,
      sun: false,
      mon: false,
      tues: false,
      wed: false,
      thur: false,
      fri: false,
      sat: false,
    };
    swal({
        title: "Are you sure you want to reset the users checkboxes?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, reset!",
        closeOnConfirm: false
      },
      function(){
        swal("Checkboxes reset!", "success");
        resetTask(resetAllObj);
      });
  }

  saveTask = async (task) => {
    let { tasks } = this.state;
    if(task && task.description && task.frequency && task.username) {
      const data = {
        description: task.description,
        frequency: task.frequency,
        username: task.username,
      }
      if(task._id) {
        data._id = task._id;
        await updateTask(data);
      } else {
        await addTask(data);
      }

      const res = await getTasks();
      if(res && res.data && res.data.length) {
        const newAdded = res.data.filter( n => {
          return n.description.toString() === task.description.toString() && n.username.toString() === task.username.toString() && task.frequency.toString() === n.frequency.toString();
        })
        tasks = tasks.map((t) => {
          if(t._id) {
            if(t._id === task._id) {
              return {
                ...t,
                editable: false,
              }
            }
          }
          if(t.id === task.id) {
            const dd = {
              ...t,
              ...newAdded[0],
              editable: false,
            }
            delete dd.id;
            return dd;
          }
          return t;
        });
        this.setState({
          allTasks: res.data,
          tasks
        })
      }
    }
  }

  onTaskChange = (e, i) => {
    let { tasks } = this.state;
    tasks = tasks.map((p, i1) => {
      if(i === i1) {
        return {
          ...p,
          [e.target.name]: e.target.value,
        }
      }
      return p;
    });

    this.setState({
      tasks
    })

  }

  render(){
    const { frequencies, taskShow, users, currentUser, admin, firstname, calendar, lastname, username, password, allowance,  isShow, rows, editableIndex, tasks, taskUser, description, frequency, searchText} = this.state;
    return (
      <div className="container" style={{marginTop: 85}}>
        <div className="panel panel-default">
          <div className="panel-heading"><b>ADD USER</b></div>
          <div className="panel-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group row">
                <div className="col-md-3">
                  <input className="form-control" type="text" name="firstname" value={firstname} onChange={this.onChange} placeholder="First Name" required/>
                </div>
                <div className="col-md-3">
                  <input className="form-control" type="text" name="lastname" value={lastname} onChange={this.onChange} placeholder="Last Name" required/>
                </div>
                <div className="col-md-3">
                  <input className="form-control" type="text" name="username" value={username} onChange={this.onChange} placeholder="Username" required/>
                </div>
                <div className="col-md-3">
                  <input className="form-control" type="password" name="password" value={password} onChange={this.onChange} placeholder="Password" required/>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-md-6">
                  <input className="form-control" type="text" name="calendar" value={calendar} onChange={this.onChange} placeholder="Link to google embedded calendar"/>
                </div>

                <div className="form-inline col-md-4">
                  <div className="form-group">
                    <lable><b>Allowance:</b></lable>
                    <input className="form-control" type="number" name="allowance" value={allowance} onChange={this.onChange} min="0" max="20" required/>
                  </div>
                  <div className="form-group" style={{'marginLeft': 38}} >
                    <lable><b>Admin:</b></lable>
                    <select name="admin" value={admin} className="form-control" style={{height: 34}} onChange={this.onChange}>
                      <option value=""/>
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  </div>
                </div>
                <div style={{'float': 'right'}}>
                  <button type="submit" className="btn btn-primary">Submit</button>
                  <button type="button" className="btn btn-primary ml-2" onClick={this.isShowTable}>{isShow ? 'Hide Users' : 'Show Users' }</button>
                </div>
              </div>
            </form>
          </div>
          {
            isShow &&
              <table style={table}>
                <thead>
                <tr>
                  <th style={table}>First</th>
                  <th style={table}>Last</th>
                  <th style={table}>Username</th>
                  <th style={table}>Allowance</th>
                  <th style={table}>Admin</th>
                  <th style={table}>Calendar Link</th>
                  <th style={table}>Remove User</th>
                  <th style={table}>Reset Checkboxes</th>
                </tr>
                </thead>
                <tbody>
                  {
                    users.map((user, i) => {
                      return currentUser && currentUser._id !== user._id &&
                      <tr key={i}>
                        <td style={table}>{user.firstname}</td>
                        <td style={table}>{user.lastname}</td>
                        <td style={table}>{user.username}</td>
                        <td style={table}>${user.allowance}.00</td>
                        <td style={table}>{user.admin.toString()}</td>
                        <td style={table}>{user.calendar.toString()}</td>
                        <td style={table}>
                          {!user.admin && <button type="button" className="btn btn-default btn-danger" onClick={() => this.removeUser(user._id)}>Delete</button>}
                        </td>
                        <td style={table}>
                          {!user.admin && <button type="button" className="btn btn-default btn-danger" onClick={() => this.resetUser(user.username)}>Reset</button>}
                        </td>
                      </tr>
                    })
                  }
                </tbody>
              </table>
          }
        </div>
        <div className="col-md-4 form-group">
          <div className="input-group" style={{'marginLeft': -15}}>
            <div className="input-group-addon"><i className="fa fa-search"/></div>
            <input type="text" className="form-control" name="searchText" placeholder="Search" value={searchText} onChange={this.onSearch} />
          </div>
        </div>
        <table className="table table-bordered" style={{'marginLeft': 0}}>
          <tbody>
          <tr style={{fontWeight: 'bold'}}>
            <td style={{width: '35%'}}>
              Responsibility
            </td>
            <td style={{width: '20%'}}>
              Frequency
            </td>
            <td style={{width: '20%'}}>
              User
            </td>
            <td style={{width: '25%'}}>
              Edit
            </td>
          </tr>
          {
            taskShow && tasks.map((task, i) => {
              return (
                task._id ?
                <tr key={i}>
                  <td>
                    <div className="form-group">
                      {
                        task.editable ?
                        <input type="text" name="description" value={task.description} className="editable-input form-control" onChange={(e) => this.onTaskChange(e, i)}/>
                        : <span className="editable">{task.description}</span>
                      }
                    </div>
                  </td>
                  <td>
                    <div className="form-group">
                      {
                        task.editable ?
                          <select name="frequency" className="form-control" value={task.frequency} style={{height: 34}} onChange={(e) => this.onTaskChange(e, i)}>
                            <option value=""/>
                            {
                              frequencies.map((f) => (
                                <option key={f} value={f}>{f}</option>
                              ))
                            }
                          </select>
                          : <span className="editable">{this.showFrequency(task)}</span>
                      }
                    </div>
                  </td>
                  <td>
                    <div className="form-group">
                      {
                        task.editable ?
                          <select name="username" value={task.username} className="form-control" style={{height: 34}} onChange={(e) => this.onTaskChange(e, i)}>
                            <option value=""/>
                            {
                              users.map((user) => {
                                return currentUser && currentUser._id !== user._id && <option key={user._id} value={user.username}>{user.username}</option>
                              })
                            }
                          </select>
                          : <span className="editable">{this.showUsername(task)}</span>
                      }
                    </div>
                  </td>
                  <td className="text-center">
                    { task.editable ?
                      <div className="buttons" >
                        <button type="button"  style={{display: 'inline-block'}} className="btn btn-primary" onClick={() => this.saveTask(task)}>
                          save
                        </button>
                        <button type="button"  style={{display: 'inline-block'}} className="btn btn-default ml-3" onClick={() => this.onEditableCancel(i)}>
                          cancel
                        </button>
                      </div>
                      :
                      <div className="buttons">
                        <button type="button" className="btn btn-primary" onClick={() => this.onEditable(i)}>edit</button>
                        <button type="button" className="btn btn-danger" onClick={() => this.removeTask(i, task._id)} >del</button>
                      </div>
                    }
                  </td>
                </tr>
                :
                <tr key={i}>
                  <td>
                    <div className="form-group">
                      {
                        task.isNew ?
                          <input type="text" name="description" value={task.description} className="editable-input form-control" onChange={(e) => this.onTaskChange(e, i)}/>
                          : <span className="editable text-danger">{task.description || 'empty' }</span>
                      }
                    </div>
                  </td>
                  <td>
                    <div className="form-group">
                      {
                        task.isNew ?
                          <select name="frequency" className="form-control" value={task.frequency} style={{height: 34}} onChange={(e) => this.onTaskChange(e, i)}>
                            <option value=""/>
                            {
                              frequencies.map((f) => (
                                <option key={f} value={f}>{f}</option>
                              ))
                            }
                          </select>
                          : <span className="editable text-danger">{this.showFrequency(task)}</span>
                      }
                    </div>
                  </td>
                  <td>
                    <div className="form-group">
                      {
                        task.isNew ?
                          <select name="username" value={task.username} className="form-control" style={{height: 34}} onChange={(e) => this.onTaskChange(e, i)}>
                            <option value=""/>
                            {
                              users.map((user) => {
                                return currentUser && currentUser._id !== user._id && <option key={user._id} value={user.username}>{user.username}</option>
                              })
                            }
                          </select>
                          : <span className="editable text-danger">{this.showUsername(task)}</span>
                      }
                    </div>
                  </td>
                  <td>
                    { task.editable ?
                      <div className="buttons" >
                        <button type="button"  style={{display: 'inline-block'}} className="btn btn-primary" onClick={() => this.saveTask(task)}>
                          save
                        </button>
                        <button type="button"  style={{display: 'inline-block'}} className="btn btn-default ml-3" onClick={() => this.onEditableCancel(i)}>
                          cancel
                        </button>
                      </div>
                      :
                      <div className="buttons">
                        <button type="button" className="btn btn-primary" onClick={() => this.onEditable(i)}>edit</button>
                        <button type="button" className="btn btn-danger" onClick={() => this.removeTask(i, task._id)} >del</button>
                      </div>
                    }
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
        <div className="btn-group ng-scope">
          <button type="button" className="btn btn-default btn-primary" onClick={this.addRow} disabled={!taskShow}>Add Task</button>
          <button type="button" className="btn btn-default btn-primary" onClick={this.handleTask}>{taskShow ? 'Hide Task List' : 'Show Task List' }</button>
        </div>
      </div>
    )
  }
}

export default AdminHome
