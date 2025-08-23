import express from 'express'

import { addDoctor, adminLogin } from '../controllers/adminController.js'

import upload from '../middlewares/multer.js'
import authLogin from '../middlewares/authLogin.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authLogin, upload.single('image'), addDoctor)
adminRouter.post('/login', adminLogin)

export default adminRouter;