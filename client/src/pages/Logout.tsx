import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { __api__ } from '../constants/endpoint'

export const Logout: React.FC = () => {
  const history = useHistory()
  useEffect(() => {
    const asynchronous = async () => {
      await fetch(`${__api__}/logout`, { method: 'POST', credentials: 'include' })
      window.location.href='/'
    }
    asynchronous()
  }, [history])

  return <div>Logout</div>
}