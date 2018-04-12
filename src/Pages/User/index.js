import React, { Component } from 'react'
import { Pie as Piechart } from 'react-chartjs-2'
import BigCalendar from 'react-big-calendar-like-google'
import moment from 'moment'
import 'chart.js'
import { getUserTasks } from '../../utils/_data'
BigCalendar.momentLocalizer(moment);
let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

class User extends Component {
  state = {
    currentUser: {},
    events: [
      {
        'title': 'All Day Event very long title',
        'bgColor': '#ff7f50',
        'allDay': true,
        'start': new Date(2018, 3, 0),
        'end': new Date(2018, 3, 1)
      },
      {
        'title': 'Long Event',
        'start': new Date(2018, 3, 7),
        'end': new Date(2018, 3, 10)
      },

      {
        'title': 'DTS STARTS',
        'bgColor': '#dc143c',
        'start': new Date(2018, 2, 13, 0, 0, 0),
        'end': new Date(2018, 2, 20, 0, 0, 0)
      },
      {
        'title': 'DTS ENDS',
        'bgColor': '#ff8c00',
        'start': new Date(2018, 10, 6, 0, 0, 0),
        'end': new Date(2018, 10, 13, 0, 0, 0)
      },

      {
        'title': 'Some Event',
        'bgColor': '#9932cc',
        'start': new Date(2018, 3, 9, 0, 0, 0),
        'end': new Date(2018, 3, 9, 0, 0, 0)
      },
      {
        'title': 'Conference',
        'bgColor': '#e9967a',
        'start': new Date(2018, 3, 11),
        'end': new Date(2018, 3, 13),
        desc: 'Big conference for important people'
      },
      {
        'title': 'Meeting',
        'bgColor': '#8fbc8f',
        'start': new Date(2018, 3, 12, 10, 30, 0, 0),
        'end': new Date(2018, 3, 12, 12, 30, 0, 0),
        desc: 'Pre-meeting meeting, to prepare for the meeting'
      },
      {
        'title': 'Lunch',
        'bgColor': '#cd5c5c',
        'start':new Date(2018, 3, 12, 12, 0, 0, 0),
        'end': new Date(2018, 3, 12, 13, 0, 0, 0),
        desc: 'Power lunch'
      },
      {
        'title': 'Happy Hour',
        'start':new Date(2018, 3, 12, 12, 0, 0, 0),
        'end': new Date(2018, 3, 12, 13, 0, 0, 0),
        desc: 'Power lunch happy hour'
      },
      {
        'title': 'Meeting',
        'bgColor': '#da70d6',
        'start':new Date(2018, 3, 12,14, 0, 0, 0),
        'end': new Date(2018, 3, 12,15, 0, 0, 0)
      },
      {
        'title': 'Happy Hour',
        'bgColor': '#eee8aa',
        'start':new Date(2018, 3, 17, 17, 0, 0, 0),
        'end': new Date(2018, 3, 17, 17, 30, 0, 0),
        desc: 'Most important meal of the day'
      },
      {
        'title': 'Dinner',
        'bgColor': '#98fb98',
        'start':new Date(2018, 3, 15, 20, 0, 0, 0),
        'end': new Date(2018, 3, 15, 21, 0, 0, 0)
      },
      {
        'title': 'Birthday Party',
        'bgColor': '#afeeee',
        'start':new Date(2018, 3, 13, 7, 0, 0),
        'end': new Date(2018, 3, 13, 10, 30, 0)
      },
      {
        'title': 'Birthday Party 2',
        'bgColor': '#db7093',
        'start':new Date(2018, 3, 13, 7, 0, 0),
        'end': new Date(2018, 3, 13, 10, 30, 0)
      },
      {
        'title': 'Birthday Party 3',
        'bgColor': '#cd853f',
        'start':new Date(2018, 3, 13, 7, 0, 0),
        'end': new Date(2018, 3, 13, 10, 30, 0)
      },
      {
        'title': 'Late Night Event',
        'bgColor': '#b0e0e6',
        'start':new Date(2018, 3, 17, 19, 30, 0),
        'end': new Date(2018, 3, 18, 2, 0, 0)
      },
      {
        'title': 'Multi-day Event',
        'start':new Date(2018, 3, 20, 19, 30, 0),
        'end': new Date(2018, 3, 22, 2, 0, 0)
      }
    ],
    data: {},
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
        _this.calcPieGraphPercent();
      })
    }
  }

  calcPieGraphPercent = () => {
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
    let data = {
      datasets: [
        {
          data: [100-progressPercent, progressPercent],
          backgroundColor: [
            '#DC143C',
            '#008000',
          ],
          hoverBackgroundColor: [
            '#f9cdcd',
            '#cce0cd',
          ]
        }
      ],
        labels: ["Keep up the great work to earn your allowance!", "Completed Chores.  Great Job!"],
    }
    this.setState({
      allowanceEarned,
      progressPercent,
      data,
    })
    return data;
  }

  clickMe = (event) => {
    alert(event && event.length && event[0]._view && event[0]._view.label)
  };

  render() {
    const { currentUser, data, events } = this.state;
    return (
      <div className="container userbackground" style={{paddingTop: 50}}>
        <h2 id="welcome" ><b>{`Welcome, ${currentUser.firstname}! Don't forget to do your chores!`}</b></h2>
        <div id="piechart">
          <Piechart data={data} onElementsClick={(e) => this.clickMe(e)} width={150} height={150} />
        </div>
        <div id="calendar">
          <BigCalendar
            events={events}
            views={allViews}
            step={60}
            defaultDate={new Date(2018, 3, 1)}
          />
        </div>
      </div>
    )
  }

}

export default User