import React, { Component } from 'react'

class FunStuff extends Component {
  render() {
    return (
      <div className="container funbackground" style={{paddingTop: 50}}>
        <div id="catimagediv">
          <div >
            <a href="http://thecatapi.com"><img className="catimage" alt="cat" src="http://thecatapi.com/api/images/get?format=src&type=gif" /></a>
          </div>
        </div>
      </div>
    )
  }
}

export default FunStuff