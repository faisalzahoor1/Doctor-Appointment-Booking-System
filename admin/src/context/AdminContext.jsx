import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [doctors, setDoctors] = useState([])


    const [atoken, setAToken] = useState(localStorage.getItem('atoken') ? localStorage.getItem('atoken') : '')
    const backend_url = import.meta.env.VITE_BACKEND_URL


    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(backend_url + '/api/admin/all-doctor', {}, { headers: { atoken } })

            if (data.success) {
                setDoctors(data.doctors)
                return data.doctors;

            } else {
                toast.error(data.message)
                console.log(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error.message)
        }
    }

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backend_url + '/api/admin/change-availability', { docId }, { headers: { atoken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get("http://localhost:4000/api/admin/appointments", { headers: { atoken } })
            if (data.success) {
                // setAppointments(data.appointments)
                return data.appointments
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post("http://localhost:4000/api/admin/cancel-appointment", { appointmentId }, { headers: { atoken } })
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDashData = async () => {
        try {

            // if (!atoken) {
            //     console.log("No token found!");
            //     return null;
            // }
            console.log("hello1")
            const { data } = await axios.get(backend_url + "/api/admin/dashboard", { headers: { atoken } })
            console.log("hello2")
            if (data.success) {
                // console.log("hello3")
                return data.dashData

            } else {
                console.log("hello3")
                toast.error(data.message)
            }
        } catch (error) {
            console.log("hello")
            toast.error(error.message)
        }
    }


    const value = {
        atoken,
        setAToken,
        backend_url,
        doctors,
        getAllDoctors,
        changeAvailability,
        getAllAppointments,
        cancelAppointment,
        getDashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider
