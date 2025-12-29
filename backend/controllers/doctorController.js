import doctorModel from "../models/doctorsModel.js"
import appointmentModel from "../models/appointmentModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availability Changed' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body

        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            return res.json({ success: false, message: "invalid credentials" })
        }
        const isMatch = await bcrypt.compare(password, doctor.password)
        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {expiresIn:'4h'})

            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'invalid credentials' })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const doctorAppointments = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({ docId: req.docId })

        res.json({ success: true, appointments })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const appointmentComplete = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const docId = req.docId

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted:true})
            return res.json({success:true, message:'Appointment Completed'})
        }else{
            return res.json({success:false, message:'Mark Failed'})
        }

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const docId = req.docId

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        } else {
            return res.json({ success: false, message: 'Cancellation Failed' })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const doctorDashboard = async(req, res)=>{
    try {
        const appointments = await appointmentModel.find({docId:req.docId})
        let earnings = 0;

        appointments.map((item)=>{
            if (item.isCompleted || item.payment) {
                earnings +=item.amount
            }
        })
        let patients = []
        appointments.map((item)=>{
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        console.log("in controller")
        res.json({success:true, dashData})
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export { changeAvailability, doctorList, loginDoctor, doctorAppointments, appointmentComplete, appointmentCancel, doctorDashboard }