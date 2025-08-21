



const addDoctor = async (req, res)=>{
    try {
        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body
        const imagefile = req.file

        console.log({name, email, password, speciality, degree, experience, about, fees, address}, imagefile)
        
    } catch (error) {
        
    }
}


export {addDoctor}

