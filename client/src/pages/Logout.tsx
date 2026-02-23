import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { __api__ } from '../constants/endpoint'

export const Logout: React.FC = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const logout = async () => {
      await fetch(`${__api__}/logout`, { method: 'POST', credentials: 'include' })
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    logout()
  }, [navigate])

  return <div>Logout</div>
}
