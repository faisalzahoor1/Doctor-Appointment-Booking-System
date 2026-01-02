import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorsModel from '../models/doctorsModel.js'
import appointmentModel from '../models/appointmentModel.js'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'


const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imagefile = req.file

        // checking details
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "please enter full detail" })
        }

        // checking email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "please enter validate email" })
        }
        // for strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "please enter strong password" })
        }
        // for encrypting password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // for upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imagefile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url


        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorsModel(doctorData)
        await newDoctor.save()

        res.json({ success: true, message: "Doctor Added" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email, process.env.JWT_SECRET)
            // const token = jwt.sign(
            //     { key: email + password },
            //     process.env.JWT_SECRET,
            //     { expiresIn: '4h' }
            // )

            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid Credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const allDoctor = async (req, res) => {
    try {
        const doctors = await doctorsModel.find({}).select('-password')
        console.log(doctors)
        res.json({ success: true, doctors })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const appointmentCancelled = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)


        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })


        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorsModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorsModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorsModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})


        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: [...appointments].reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { addDoctor, adminLogin, allDoctor, appointmentsAdmin, appointmentCancelled, adminDashboard }

