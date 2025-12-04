import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const Login = () => {

  const { backend_url, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [state, setState] = useState('Sign up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmit = async(event) => {
    event.preventDefault();

    try {
        if (state === 'Sign up') {
          const {data} = await axios.post(backend_url+'/api/user/register', {name, email, password})
          if (data.success) {
            localStorage.setItem('token', data.token)
            setToken(data.token)
          }else{
            toast.error(data.message)
          }
        }else{
          const {data} = await axios.post(backend_url+'/api/user/login', {email, password})
          if (data.success) {
            localStorage.setItem('token', data.token)
            setToken(data.token)
          }else{
            toast.error(data.message)
          }
        }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    if (token) {
     navigate('/')
    }
  },[token])
  return (
    <form onSubmit={onSubmit} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign up' ? "Create account" : "Log in"}</p>
        <p>Please {state === 'Sign up' ? "sign up" : "login"} to book appointment</p>
        {state === 'Sign up' &&
          <div className='w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" required onChange={(e) => setName(e.target.value)} value={name} />
          </div>
        }
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" required onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" required onChange={(e) => setPassword(e.target.value)} value={password} />
        </div>
        <button type='submit' className='bg-blue-500 text-white w-full py-2 rounded-md text-base'>{state === 'Sign up' ? "Create account" : "Log in"}</button>
        {
          state === 'Sign up' ? <p>Already have an account? <span className='text-blue-500 underline cursor-pointer' onClick={() => setState('Log in')}>Login here</span></p> : <p>Create an account? <span className='text-blue-500 underline cursor-pointer' onClick={() => setState('Sign up')}>Click here</span></p>
        }
      </div>
    </form>
  )
}
