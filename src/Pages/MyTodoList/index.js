import React, { Component } from 'react'
import { getUserTasks, updateTaskCheckbox } from '../../utils/_data'
import houseImage from '../../assets/images/house.svg'

class MyTodoList extends Component {
  state = {
    tasks: [],
    currentUser: {},
    progressPercent: '0%'
  }

  componentWillMount() {
    const currentUser = (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) || {};
    if(currentUser && currentUser._id) {
      this.setState({
        currentUser
      })
      this.getTask(currentUser.username);
    }
  }

  getTask = async (username) => {
    const res = await getUserTasks(username);
    const _this = this;
    if(res && res.data && res.data.length) {
      this.setState({
        tasks: res.data,
      }, () => {
        _this.calcReward();
      })
    }
  }

  saveCheck = async (e, i, task) => {
    const { tasks } = this.state;
    let counter = 0;
    let limit = 0;
    task[e.target.name] = e.target.checked;
    for (let key in task){
      limit = task.frequency;
      if (task[key] === true && counter < limit) {
        counter += 1;
      }
      task.checkboxcount = counter;
      console.log(task.checkboxcount);
    }
    task[e.target.name] = e.target.checked;
    await updateTaskCheckbox(task);
    this.calcReward();
    tasks[i] = task;
    this.setState({
      tasks
    })
  }

  calcReward = () => {
    const { currentUser, tasks } = this.state;
    let completedTasks = 0;
    let required = 0;
    tasks.forEach((task) => {
      completedTasks += parseInt(task.checkboxcount, 10);
      required += parseInt(task.frequency, 10);
    })
    let greenDone = (completedTasks/required)*100;
    let allowanceEarned = ((greenDone/100)*(currentUser.allowance)).toFixed(0);
    let progressPercent = greenDone.toFixed(0);
    let data = (allowanceEarned, progressPercent);
    this.setState({
      allowanceEarned,
      progressPercent,
    })
    return data;
  }

  render() {
    const { currentUser, tasks, allowanceEarned, progressPercent } = this.state;
    const processStyle = {
      width: `${parseInt(progressPercent, 10)}%`
    }
    return (
      <div className="container listbackground">
        <div className="col-md-12" id="welcome" style={{display: 'inline-block', marginTop: 70 }}>
          <img src={houseImage} className="icons" alt="house"/><h1 style={{fontSize: 25}} className="lead"><b>{currentUser.firstname}, here are your responsibilities for the week!</b></h1>
        </div>
        <table id="checklisttable">
          <tbody>
          <tr>
            <th>Task</th>
            <th>Required</th>
            <th>Sunday</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            <th>Completed</th>
          </tr>
          {
            tasks && tasks.length ? tasks.map((task, i) => (
              <tr key={i}>
                <td>{task.description}</td>
                <td>{task.frequency }</td>
                <td><input name="suncheckbox" checked={task.suncheckbox} type="checkbox" onChange={(e) => this.saveCheck(e, i, task)} /></td>
                <td><input name="moncheckbox" checked={task.moncheckbox} type="checkbox" onChange={(e) => this.saveCheck(e, i, task)} /></td>
                <td><input name="tuescheckbox" checked={task.tuescheckbox} type="checkbox" onChange={(e) => this.saveCheck(e, i, task)} /></td>
                <td><input name="wedcheckbox" checked={task.wedcheckbox} type="checkbox" onChange={(e) => this.saveCheck(e, i, task)} /></td>
                <td><input name="thurcheckbox" checked={task.thurcheckbox} type="checkbox" onChange={(e) => this.saveCheck(e, i, task)} /></td>
                <td><input name="fricheckbox" checked={task.fricheckbox} type="checkbox" onChange={(e) => this.saveCheck(e, i, task)} /></td>
                <td><input name="satcheckbox" checked={task.satcheckbox} type="checkbox" onChange={(e) => this.saveCheck(e, i, task)} /></td>
                <td>{task.checkboxcount} / {task.frequency}</td>
              </tr>
            )) : null
          }
          </tbody>
        </table>
        <div id="allowancebar">
          <h3><b>Allowance Earned:</b></h3>
          <div className="progress">
            <div className="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow={70} aria-valuemin={0} aria-valuemax={100} style={processStyle}>
              <h3>${allowanceEarned}.00/${currentUser.allowance}.00</h3>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default MyTodoList