import express from 'express'

import {appointmentCancel, appointmentComplete, doctorAppointments, doctorDashboard, doctorList, doctorProfile, loginDoctor, updateProfile} from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments',authDoctor, doctorAppointments)
doctorRouter.post('/appointment-complete',authDoctor, appointmentComplete)
doctorRouter.post('/appointment-cancel',authDoctor, appointmentCancel)
doctorRouter.get('/doctor-dashboard',authDoctor, doctorDashboard)
doctorRouter.get('/doctor-profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateProfile)

export default doctorRouter;