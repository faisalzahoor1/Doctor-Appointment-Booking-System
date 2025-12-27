import express from 'express'

import { addDoctor, adminDashboard, adminLogin, allDoctor, appointmentCancelled, appointmentsAdmin } from '../controllers/adminController.js'

import upload from '../middlewares/multer.js'
import authLogin from '../middlewares/authLogin.js'
import { changeAvailability } from '../controllers/doctorController.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authLogin, upload.single('image'), addDoctor)
adminRouter.post('/all-doctor', authLogin, allDoctor)
adminRouter.post('/login', adminLogin)
adminRouter.post('/change-availability', authLogin, changeAvailability)
adminRouter.get('/appointments', authLogin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authLogin, appointmentCancelled)
adminRouter.get('/dashboard', authLogin, adminDashboard)

export default adminRouter;