import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

export const MyAppointments = () => {
  const {doctors} = useContext(AppContext)
  return (
    <div>
        <p className='mr-8 ml-16 pb-3 mt-12 font-medium text-zinc-500 border-b'>My appointments</p>
        <div>
          {
            doctors.slice(0,2).map((item, index) =>(
              <div className='mr-8 ml-16 grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
                <div>
                  <img className='w-32 bg-indigo-300' src={item.image} alt="" />
                </div>
                <div className='flex-1 text-sm text-zinc-600'>
                  <p className='text-neutral-800 text-smibold'>{item.name}</p>
                  <p>{item.speciality}</p>
                  <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                  <p className='text-xs'>{item.address.line1}</p>
                  <p className='text-xs'>{item.address.line2}</p>
                  <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>10 Sep 2025 | 10:00 AM</p>
                </div>
                <div></div>
                <div className='flex flex-col gap-2 justify-end'>
                  <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer'>Pay online</button>
                  <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer'>Cancel appointment</button>
                </div>
              </div>
            ))
          }
        </div>
    </div>
  )
}
