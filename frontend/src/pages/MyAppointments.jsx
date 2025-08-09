import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

export const MyAppointments = () => {
  const {doctors} = useContext(AppContext)
  return (
    <div>
        <p>My appointments</p>
        <div>
          
        </div>
    </div>
  )
}
