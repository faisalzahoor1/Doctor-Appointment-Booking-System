import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext';
import { toast } from "react-toastify";
import axios from 'axios'
import { assets } from '../assets/assets_frontend/assets.js'


export const MyProfile = () => {
  const { token, backend_url } = useContext(AppContext)

  const [userData, setUserData] = useState(false);
  const [isedited, setIsedited] = useState(false);
  const [image, setImage] = useState(false)



  const loadProfileData = async () => {
    try {
      // console.log("code")
      const { data } = await axios.get(backend_url + '/api/user/get-profile', { headers: { token } })
      if (data.success) {
        setUserData(data.userData)
      } else {

        toast.error(data.message + "data is not coming from backend")
      }

    } catch (error) {
      // console.log("faisal")
      toast.error(error.message)
    }
  }
  useEffect(() => {
    if (token) {
      // console.log("hello")
      loadProfileData()
    } else {
      setUserData(false)
    }
  }, [token])

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()

      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('dob', userData.dob)
      formData.append('gender', userData.gender)
      image && formData.append('image', image)

      const { data } = await axios.post(backend_url + '/api/user/update', formData, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        await loadProfileData()
        setIsedited(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return userData && (
    <div className='ml-16 max-w-lg flex flex-col gap-2 text-sm'>
      {
        isedited ? <label htmlFor="image">
          <div className='inline-block relative cursor-pointer'>
            <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
            <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
          </div>
          <input onChange={(e) => { setImage(e.target.files[0]) }} type="file" id='image' hidden />
        </label>
          : <img className='w-36 rounded' src={userData.image} alt="" />
      }

      {
        isedited ? <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type="text" value={userData.name} onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} /> :
          <p className='text-3xl font-medium text-neutral-800 mt-4'>{userData.name}</p>
      }
      <hr className='bg-zinc-400 border-none h-[1px]' />
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700 '>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>

          <p className='font-medium'>Phone:</p>
          {
            isedited ? <input className='bg-gray-100 max-w-52' type="text" value={userData.phone} onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} /> :
              <p className='text-blue-400'>{userData.phone}</p>
          }

          <p className='font-medium' >Address:</p>
          {
            isedited ? <p>
              <input className='bg-gray-50' type="text" value={userData.address.line1} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} />
              <br />
              <input className='bg-gray-50' type="text" value={userData.address.line2} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} />
            </p> :
              <p className='text-gray-500'>
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
          }
        </div>
      </div>
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700 '>
          <p className='font-medium'>Gender:</p>
          {
            isedited ? <select className='max-w-20 bg-gray-100' value={userData.gender} onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select> :
              <p className='text-gray-400'>{userData.gender}</p>
          }
          <p className='font-medium'>Birthday:</p>
          {
            isedited ? <input className='max-w-28 bg-gray-100' type="date" value={userData.dob} onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} /> :
              <p className='text-gray-400'>{userData.dob}</p>
          }
        </div>
      </div>
      <div className='mt-10'>
        {
          isedited ? <button className='border border-blue-500 px-8 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-500' onClick={updateUserProfileData}>Save information</button> :
            <button className='border border-blue-500 px-8 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-500' onClick={() => setIsedited(true)}>Edit</button>
        }
      </div>
    </div>
  )
}
