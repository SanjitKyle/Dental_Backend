// routes entry point for appointment-service
import express from 'express';
import { Auth } from '../middleware/index.js';
import * as AppointmentController from '../controllers/index.js';

const AppointmentRouter = express.Router()

AppointmentRouter.post("/", Auth, AppointmentController.createAppointment);
AppointmentRouter.get("/", Auth, AppointmentController.getAppointments);
AppointmentRouter.get("/:id", Auth, AppointmentController.getAppointmentById);
AppointmentRouter.post("/:id", Auth, AppointmentController.updateAppointment);
AppointmentRouter.post("/delete/:id", Auth, AppointmentController.deleteAppointment);

export default AppointmentRouter;