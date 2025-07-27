
import React from "react"
import {Route, Routes} from 'react-router-dom'
import { Home } from "./pages/Home"
import { About } from "./pages/About"
import { Contact } from "./pages/Contact"
import { Login } from "./pages/Login"
import { Doctors } from "./pages/Doctors"
import { MyProfile } from "./pages/MyProfile"
import { MyAppointments } from "./pages/MyAppointments"
import { DoctorsAppointments } from "./pages/DoctorsAppointments"
import { Navbar } from "./components/Navbar"

function App() {

  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/doctors" element={<Doctors/>}/>
        <Route path="/doctors/:speciality" element={<Doctors/>}/>
        <Route path="/my-profile" element={<MyProfile/>}/>
        <Route path="/my-appointments" element={<MyAppointments/>}/>
        <Route path="/doctors-appointments/:docId" element={<DoctorsAppointments/>}/>
      </Routes>
    </>
  )
}

export default App
