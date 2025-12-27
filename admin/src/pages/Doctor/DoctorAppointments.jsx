import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets_admin/assets'

const DoctorAppointments = () => {

  const { dtoken, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const [appointments, setAppointments]  = useState([])
  const {calculateAge, slotDateFormat, currency} = useContext(AppContext)

  const getDoctor = async () => {
    if (dtoken) {
      let list1 = await getAppointments()
      console.log(list1)
      setAppointments(list1)
      console.log(appointments)
    }

  }

  useEffect(() => {
    getDoctor()
  }, [dtoken])
  return appointments && (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gp-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Data & Time</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {
          appointments.map((item, index)=>(
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100' key={index}>
              <p className='max-sm:hidden'>{index+1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item.userData.image} alt="" /> 
                <p className=''>{item.userData.name}</p>
              </div>
              <div>
                <p className='text-xs inline border border-primary px-2 rounded-full'>
                  {
                    item.payment? 'Online':'Cash'
                  }
                </p>
              </div>
              <p className='max-sm:hidden'>
                {calculateAge(item.userData.dob)}
              </p>
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
              <p>{currency} {item.amount}</p>
              <div className='flex'>
                <img onClick={()=>cancelAppointment(item._id)}  className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" /><img onClick={()=>completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
              </div>
            </div>
          ))
        }
      </div>


    </div>
  )
}

export default DoctorAppointments