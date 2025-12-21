import express from 'express'
import { userLogin, userRegister, userProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment } from '../controllers/userController.js'
import upload from '../middlewares/multer.js'
import usersLogin from '../middlewares/usersLogin.js'

const userRouter = express.Router()

userRouter.post('/register', userRegister)
userRouter.post('/login', userLogin)
userRouter.get('/get-profile',usersLogin, userProfile)
userRouter.post('/update',usersLogin, upload.single('image'), updateProfile)
userRouter.post('/book-appointment',usersLogin, bookAppointment) 
userRouter.get('/appointments',usersLogin, listAppointment)
userRouter.post('/cancel-appointment',usersLogin, cancelAppointment)
// userRouter.post('/payment-razorpay', usersLogin, paymentRazorpay)

export default userRouter