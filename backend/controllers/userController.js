import validator from 'validator';
import bycrypt from 'bcrypt';
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import { json } from 'express';
import doctorModel from '../models/doctorsModel.js';
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay'

const razorpayInstance = new razorpay({
    key_id:'',
    key_secret:''
})




const userRegister = async (req, res) => {
    const { name, email, password } = req.body

    try {
        if (!name || !email || !password) {
            return res.json({ success: false, message: "please enter full detail" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "please enter validate email" })
        }
        // for strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "please enter strong password" })
        }
        // for encrypting password
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const userLogin = async (req, res) => {
    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not exist" })
        }
        const isMatch = await bycrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const userProfile = async (req, res) => {
    try {
        // const { userId } = req.body.userId
        const userData = await userModel.findById(req.userId).select('-password')
        // console.log(userData)
        res.json({ success: true, userData })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body
        const userId = req.userId;

        const imageFile = req.file
        if (!name || !phone || !address || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageUrl })
        }

        res.json({ success: true, message: "profile updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const bookAppointment = async (req, res) => {
    try {
        const {docId, slotDate, slotTime } = req.body
        const userId = req.userId;

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({ success: false, message: "doctor not available" })
        }
        let slots_booked = docData.slots_booked

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "slot not available" })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)

        }
        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)

        await newAppointment.save()


        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success:true, message:"appointment booked"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const listAppointment = async (req, res)=>{
    try {
        const userId = req.userId;

        const appointments = await appointmentModel.find({userId})
        res.json({success:true, appointments})
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const cancelAppointment = async(req, res)=>{
    try {
        const {appointmentId} = req.body
        const userId = req.userId;
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: "unauthorized action" })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})


        const {docId, slotDate, slotTime} = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e!==slotTime)

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success:true, message:'Appointment Cancelled'})
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// const paymentRazorpay = async(req, res)=>{
//     try {
//         const {appointmentId} = req.body
//         const appointmentData = await appointmentModel.findById(appointmentId)

//         if(!appointmentData || appointmentData.cancelled){
//             return res.json({success:false, message:"appointment cancelled or not found"})
//         }
//         // create options for razorpay

//         const options = {
//             amount: appointmentData.amount * 100,
//             currency: process.env.CURRENCY,
//             receipt: appointmentId,
//         }

//         // create an order
//         const order = await razorpayInstance.order.create(options)
//         res.json({success:true, order})

//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }
export { userRegister, userLogin, userProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay }