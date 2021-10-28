import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAppState } from '../providers/appProvider'

export const AdminRoute: React.FC<RouteProps> = ({ 
  children, 
  ...rest 
}) => {
  const { state } = useAppState()
  
  if(state.user?.role === 'admin') {
    return <Route {...rest}>{children}</Route>
  }

  return <Redirect to="/admin/login" />
}