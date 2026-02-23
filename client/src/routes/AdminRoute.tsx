import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppState } from '../providers/appProvider'

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAppState()

  if(state.user?.role === 'admin') {
    return <>{children}</>
  }

  return <Navigate to="/admin/login" replace />
}
