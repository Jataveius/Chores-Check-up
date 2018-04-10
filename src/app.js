import React from 'react'
import utils from './utils'
import LoggedIn from './Pages/LoggedIn'
import LoggedOut from './Pages/LoggedOut'
import './app.css'
import './assets/css/style.css'
import 'bootstrap-sweetalert/dist/sweetalert.css'

const isUser = () => {

  if ( utils.getCookie( 'auth' ) && utils.getCookie( 'userId' ) ) {

    return true

  }

  return false

}

const App = () => (
  <div className="app" lang="EN">
    {
      isUser() ? <LoggedIn /> : <LoggedOut />
    }
  </div>
)

export default App
