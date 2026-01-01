import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const [dtoken, setDToken] = useState(localStorage.getItem('dtoken') ? localStorage.getItem('dtoken') : '')
    const backend_url = import.meta.env.VITE_BACKEND_URL
    


    const getAppointments = async()=>{
        try {
            // console.log("hello")
            const {data} = await axios.get("http://localhost:4000/api/doctor/appointments", {headers:{dtoken}})
            // console.log("hello1")
            if (data.success) {
                // console.log("hello2")
                return data.appointments.reverse()
            }else{
                // console.log("hello3")
                toast.error(data.message)
            }
        } catch (error) {
            // console.log("hello4")
            toast.error(error.message)
        }
    } 

    const completeAppointment = async(appointmentId)=>{
        try {
            console.log("hello1")
            const {data} = await axios.post("http://localhost:4000/api/doctor/appointment-complete", {appointmentId}, {headers:{dtoken}})
            console.log("hello2")
            if (data.success) {
                toast.success(data.message)
                console.log("hello")
                getAppointments()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
        const cancelAppointment = async(appointmentId)=>{
        try {
           
            const {data} = await axios.post("http://localhost:4000/api/doctor/appointment-cancel", {appointmentId}, {headers:{dtoken}})
            
            if (data.success) {
           
                toast.success(data.message)
                getAppointments()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const dashData = async()=>{
        try {
            console.log("hello3")
            const {data} = await axios.get("http://localhost:4000/api/doctor/doctor-dashboard", {headers:{dtoken}})
            console.log("hell4")
            if (data.success) {
                console.log("hello")
                return data.dashData
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            
            toast.error(error.message)
        }
    }

    const getProfileData = async()=>{
        try {
            const {data} = await axios.get("http://localhost:4000/api/doctor/doctor-profile", {headers:{dtoken}})
            if (data.success) {
                return data.profileData
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        dtoken,setDToken, 
        backend_url,
        getAppointments, completeAppointment, cancelAppointment,
        dashData, getProfileData
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider
