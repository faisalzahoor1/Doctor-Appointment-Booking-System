import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
export const MyAppointments = () => {
  const { token, getDoctorsData, backend_url } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  const months = [
    " ",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointment = async () => {
    try {
      const { data } = await axios.get(backend_url + '/api/user/appointments', { headers: { token } })
      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backend_url + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointment()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // const initPay  = (order)=>{
  //   const options = {
  //     key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  //     amount: order.amount,
  //     currency: order.currency,
  //     name: 'Appointment Payment',
  //     description: 'Appointment Payment',
  //     order_id: order.id,
  //     receipt: order.receipt,
  //     handler: async (response)=>{
  //       console.log(response)
  //     }
  //   }

  //   const rzp = new window.Razorpay(options)
  //   rzp.open()
  // }

  // const appointmentRazorpay = async(appointmentId)=>{
  //   try {
  //     const {data} = await axios.post('http://localhost:4000/api/user/payment-razorpay', { appointmentId }, { headers: { token } })

  //     if (data.success) {
  //       initPay(data.order)
  //     }
  //   } catch (error) {
  //     toast.error(error.message)
  //   }
  // }

  useEffect(() => {
    if (token) {
      getUserAppointment()
    }

  }, [token])

  return (
    <div>
      <p className='mr-8 ml-16 pb-3 mt-12 font-medium text-zinc-500 border-b'>My appointments</p>
      <div>
        {
          appointments.map((item, index) => (
            <div className='mr-8 ml-16 grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
              <div>
                <img className='w-32 bg-indigo-300' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 text-smibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
                {/* onClick={()=>appointmentRazorpay(item._id)} */}
                {!item.cancelled && !item.isCompleted && <button  className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer'>Pay online</button>}
                {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer'>Cancel appointment</button>}
                {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
                {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}

              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
