import express from 'express'
import { userLogin, userRegister, userProfile, updateProfile, bookAppointment } from '../controllers/userController.js'
import upload from '../middlewares/multer.js'
import usersLogin from '../middlewares/usersLogin.js'

const userRouter = express.Router()

userRouter.post('/register', userRegister)
userRouter.post('/login', userLogin)
userRouter.get('/get-profile',usersLogin, userProfile)
userRouter.post('/update',usersLogin, upload.single('image'), updateProfile)
userRouter.post('/book-appointment',usersLogin, bookAppointment) 

export default userRouter