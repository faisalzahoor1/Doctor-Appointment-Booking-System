import React, { useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'

export const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setMenu] = useState(false);
    const [token, settoken] = useState(true);
    return (
        <div className='flex items-center justify-between text-sm px-4 py-4 mb-5 border-b border-b-gray-400'>
            <img className='w-44 cursor-pointer' src={assets.logo} alt="" />
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to="/">
                    <li className='py-1'>HOME</li>
                    <hr className='border-none outline-none h-0.5 bg-blue-500 w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to="/doctors">
                    <li className='py-1'>ALL DOCTORS</li>
                    <hr className='border-none outline-none h-0.5 bg-blue-500 w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to="/about">
                    <li className='py-1'>ABOUT</li>
                    <hr className='border-none outline-none h-0.5 bg-blue-500 w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to="/contact">
                    <li className='py-1'>CONTACT US</li>
                    <hr className='border-none outline-none h-0.5 bg-blue-500 w-3/5 m-auto hidden' />
                </NavLink>
            </ul>
            <div className='flex items-center gap-4'>
                {
                    token ? <div className='flex items-center gap-2 cursor-pointer group relative'>
                            <img className='w-8 rounded-full' src={assets.profile_pic} alt="" />
                            <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                            <div className='absolute top-0 right-0 pt-14 font-medium text-gray-600 z-20 hidden group-hover:block'>
                                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                    <p className='hover:text-black cursor-pointer' onClick={()=>navigate('my-profile')}>My profile</p>
                                    <p className='hover:text-black cursor-pointer' onClick={()=>navigate('my-appointments')}>My appointments</p>
                                    <p className='hover:text-black cursor-pointer' onClick={()=>settoken(false)}>Logout</p>
                                </div>
                            </div>
                    </div >
                        : <button onClick={() => navigate('/login')} className='bg-blue-500 text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
                }
            </div>
        </div>
    )
}
