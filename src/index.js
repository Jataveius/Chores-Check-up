import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { Switch, Route } from 'react-router'
import store from './Redux/store'
import App from './app'
import NotFound from './Pages/Notfound'

render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/" component={App} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById( 'root' )
)

