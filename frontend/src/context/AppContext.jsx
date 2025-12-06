import { createContext, useEffect } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import { useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {


    const currencySymbol = '$';
    const backend_url = import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([])
    const [userData, setUserData] = useState(null);

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')

    const loadUserProfile = async () => {
        try {
            const { data } = await axios.get(backend_url + "/api/user/get-profile", {
                headers: { token }
            });

            if (data.success) {
                setUserData(data.userData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (token) {
            loadUserProfile();
        } else {
            setUserData(null);
        }
    }, [token]);



    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get('http://localhost:4000/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
                return data.doctors
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const value = {
        doctors,
        currencySymbol,
        getDoctorsData,
        backend_url,
        token,
        setToken,
        userData,
        setUserData,
        loadUserProfile
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
