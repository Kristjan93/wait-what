import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { AdminRoute } from '../routes/AdminRoute'
import { AdminControls } from './AdminControls'
import { AdminLogin } from './AdminLogin'

export const Admin: React.FC = () => {
  const match = useRouteMatch()
  return (
    <Switch>
      <Route path={`${match.path}/login`}>
        <AdminLogin />
      </Route>

      <AdminRoute path={`${match.path}`}>
        <AdminControls />
      </AdminRoute>
    </Switch>
  )
}