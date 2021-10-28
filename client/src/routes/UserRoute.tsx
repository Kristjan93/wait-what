import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAppState } from '../providers/appProvider'

export const UserRoute:React.FC<RouteProps> = ({
  children,
  ...rest
}) => {
  const { state } = useAppState()

  if(state.user?.role === 'admin') {
    return <Redirect to="/admin" />
  }

  if(state.user?.role === 'user') {
    return <Route {...rest}>{children}</Route>
  }

  return <Redirect to="/login" />
}