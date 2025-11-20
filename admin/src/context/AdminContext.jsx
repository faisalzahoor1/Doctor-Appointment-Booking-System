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
                console.log(data.doctors);

            } else {
                toast.error(data.message)
                console.log(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error.message)
        }
    }

    const changeAvailability = async(docId) =>{
        try {
            const {data} = await axios.post(backend_url+'/api/admin/change-availability',{docId}, {headers:{atoken}})
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        atoken,
        setAToken,
        backend_url,
        doctors,
        getAllDoctors,
        changeAvailability
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider
