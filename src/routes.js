import React             from 'react'
import { Switch, Route } from 'react-router'
import App               from './app'
import NotFound          from './Pages/Notfound'

export default (
  <Switch>
    <Route path="/" component={App} />
    <Route path="*" component={NotFound} />
  </Switch>
)

