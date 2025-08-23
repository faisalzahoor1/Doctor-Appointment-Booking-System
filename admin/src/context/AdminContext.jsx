import { createContext, useState } from "react";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [atoken, setAToken] = useState(localStorage.getItem('atoken')?localStorage.getItem('atoken'):'')
    const backend_url = import.meta.env.VITE_BACKEND_URL

    const value = {
        atoken,setAToken,
        backend_url 
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider
