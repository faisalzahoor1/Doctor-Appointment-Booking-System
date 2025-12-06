import React, { useContext, useEffect, useState } from 'react'
import { data, Navigate, useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

export const DoctorsAppointments = () => {

  const { docId } = useParams();
  const { doctors, currencySymbol, token, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate()

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'];

  const [DocInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const fetchDocInfo = async () => {
    const DocInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(DocInfo);
  }
  const getAvailableSlots = async () => {
    if (!DocInfo || !DocInfo.slots_booked) {
    return;   // STOP if DocInfo is not loaded
  }
    setDocSlots([]);

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currdate = new Date(today);
      currdate.setDate(today.getDate() + i);

      let endtime = new Date();
      endtime.setDate(today.getDate() + i);
      endtime.setHours(21, 0, 0, 0);


      if (today.getDate() === currdate.getDate()) {
        currdate.setHours(currdate.getHours() > 10 ? currdate.getHours() + 1 : 10);
        currdate.setMinutes(currdate.getMinutes() > 30 ? 30 : 0);
      } else {
        currdate.setHours(10);
        currdate.setMinutes(0);
      }
      let timeslots = [];

      while (currdate < endtime) {
        let formattedTime = currdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currdate.getDate()
        let month = currdate.getMonth() + 1
        let year = currdate.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const slotTime = formattedTime

        const isSlotAvailable = DocInfo.slots_booked[slotDate] && DocInfo.slots_booked[slotDate].includes(slotTime) ? false : true
        if (isSlotAvailable) {
          timeslots.push({
            dateTime: new Date(currdate),
            time: formattedTime
          })
        }
        currdate.setMinutes(currdate.getMinutes() + 30)

      }
      setDocSlots(prev => ([...prev, timeslots]))
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("login to book appointment")
      return navigate('/login')
    }

    try {
      const date = docSlots[slotIndex][0].dateTime
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year

      const { data } = await axios.post('http://localhost:4000/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate("/my-appointments")
      } else {
        console.log("hello")
        toast.error(data.message)
      }


    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [DocInfo])

  useEffect(() => {
    console.log(docSlots)
  }, [docSlots])

  return DocInfo && (
    <div>
      <div className='flex flex-col sm:flex-row gp-8'>
        <div>
          <img className='bg-blue-500 w-full sm:max-w-62 sm:mx-4 rounded-lg' src={DocInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-1 bg-white mx-2  sm:mx-2 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {DocInfo.name}
            <img className='w-4' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>
              {DocInfo.degree} - {DocInfo.speciality}
            </p>
            <button className='py-0.2 px-2  border text-xs rounded-full cursor-pointer'>{DocInfo.experience}</button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img className='w-3' src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 maz-w-[700px] mt-1'>{DocInfo.about}</p>
          </div>
          <p className='text-gray-700 font-medium mt-4'>Appointment fee: <span className='text-gray-900'>{currencySymbol}{DocInfo.fees}</span></p>
        </div>
      </div>
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item, index) => (
              <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-blue-500 text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                <p>{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            ))
          }
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4 pr-4'>
          {
            docSlots.length && docSlots[slotIndex].map((item, index) => (
              <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-blue-500 text-white' : 'text-gray-400 border border-fray-200'}`} key={index}>
                {item.time.toLowerCase()}
              </p>
            ))
          }
        </div>
        <button onClick={bookAppointment} className='bg-blue-500 text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer'>Book an appointment</button>
      </div>
      <RelatedDoctors docId={docId} speciality={DocInfo.speciality} />
    </div>
  )
}
