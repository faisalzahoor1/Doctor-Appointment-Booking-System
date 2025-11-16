import React, { useContext, useState} from 'react'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
// import assets from '../assets/assets_admin/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
    const navigate = useNavigate();
    const [state, setState] = useState('Admin')

    const {setAToken,backend_url} = useContext(AdminContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (event) =>{
        event.preventDefault()

        try {
            if (state === 'Admin') {
                const {data} = await axios.post(backend_url +'api/admin/login', {email, password})
                if (data.success) {
                    localStorage.setItem('atoken', data.token)
                    setAToken(data.token)
                    navigate('/admin-dashboard') 
                }else{
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
            <p className='text-2xl font-semibold m-auto'><span className='text-blue-500'>{state}</span> Login</p>
            <div className='w-full'>
                <p>Email:</p>
                <input onChange={(e)=>setEmail(e.target.value)}  value={email}  className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
            </div>
            <div className='w-full'>
                <p>Password:</p>
                <input onChange={(e)=>setPassword(e.target.value)} value={password}  className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
            </div>
            <button className='w-full py-2 rounded-md text-base bg-blue-500 text-white cursor-pointer'>Login</button>
            {
                state === 'Admin'?
                <p>
                    Doctor Login? <span className='underline text-blue-500 cursor-pointer' onClick={()=>setState('Doctor')}>Click here</span>
                </p>
                : <p>
                    Admin Login? <span className='underline text-blue-500 cursor-pointer' onClick={()=>setState('Admin')}>Click here</span>
                </p>
            }
        </div>
    </form>
  )
}

export default Login