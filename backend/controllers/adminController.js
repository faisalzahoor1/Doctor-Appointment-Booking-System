import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorsModel from '../models/doctorsModel.js'
import jwt from 'jsonwebtoken'


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
                const token = jwt.sign(email+password, process.env.JWT_SECRET)
                res.json({success:true, token})
            }else{
                res.json({success:false, message:"Invalid Credentials"})
            }
        } catch (error) {
            console.log(error)
            res.json({ success: false, message: error.message })
        }
    }

export { addDoctor, adminLogin }

