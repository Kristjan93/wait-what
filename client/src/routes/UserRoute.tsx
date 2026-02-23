import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppState } from '../providers/appProvider'

export const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAppState()

  if(state.user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  if(state.user?.role === 'user') {
    return <>{children}</>
  }

  return <Navigate to="/login" replace />
}
