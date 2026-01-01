import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
  const [profileData, setProfileData] = useState(false)
  const { dtoken, getProfileData, backend_url } = useContext(DoctorContext)
  const [isedited, setIsedited] = useState(false);
  const { currency } = useContext(AppContext)

  const doc_data = async () => {
    if (dtoken) {
      let list1 = await getProfileData()
      setProfileData(list1)
    }
  }
  const updateProfile = async()=>{
    try {
      const updateData = {
        address: profileData.adddress,
        fees: profileData.fees,
        available: profileData.available
      }
      console.log("hello1")
      const {data} = await axios.post(backend_url+ "/api/doctor/update-profile", updateData, {Headers:{dtoken}})
      console.log("hello2")
      if (data.success) {
        
        toast.success(data.message)
        setIsedited(false)
        getProfileData()
      }else{
        console.log("hello3")
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }
  useEffect(() => {
    doc_data()
  }, [dtoken])



  return profileData && (
    <div>

      <div className='flex flex-col gap-4 m-5' >

        <div>
          <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
        </div>

        <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{profileData.degree} - {profileData.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{profileData.about}</p>
          </div>

          <p className='text-gray-600 font-medium mt-4'>

            Appointment fee: <span className='text-gray-800'>{currency}{isedited ? <input type="number" onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} /> : profileData.fee}</span>
          </p>

          <div className='flex gap-2 py-2'>
            <p>Address:</p>
            <p className='text-sm'>
              {isedited? <input type="text" onChange={(e)=> setProfileData(prev =>({...prev, adddress:{...prev.adddress,line1:e.target.value}}))} value={profileData.address.line1} /> :profileData.address.line1}
              <br />
              {isedited? <input type="text" onChange={(e)=> setProfileData(prev =>({...prev, adddress:{...prev.adddress,line2:e.target.value}}))} value={profileData.address.line2} /> :profileData.address.line2}
            </p>
          </div>

          <div className='flex gap-1 pt-2'>
            <input onChange={()=>isedited && setProfileData(prev=>({...prev, available:!prev.available}))} checked={profileData.available} type="checkbox" name='' id='' />
            <label htmlFor=" ">Available</label>
          </div>
          {
            isedited ? <button onClick={updateProfile} className='px-4 py-1 border-blue-500 text-sm rounded-full mt-5 hover:bg-blue-500 hover:text-white transition-all'>Save Information</button>
            :<button onClick={() => setIsedited(true)} className='px-4 py-1 border-blue-500 text-sm rounded-full mt-5 hover:bg-blue-500 hover:text-white transition-all'>Edit</button>
          }

         

        </div>

      </div>

    </div>
  )
}
export default DoctorProfile