import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { AdminRoute } from '../routes/AdminRoute'
import { AdminControls } from './AdminControls'
import { AdminLogin } from './AdminLogin'

export const Admin: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="*" element={<AdminRoute><AdminControls /></AdminRoute>} />
    </Routes>
  )
}
