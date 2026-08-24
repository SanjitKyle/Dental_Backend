// controllers entry point for appointment-service
import * as AppointmentService from '../services/index.js'
export const createAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const data = req.body;
        const finaldata = { ...data, created_by: userId };
        const created = await AppointmentService.createAppointment(finaldata)
        if (!created) {
            return res.status(500).json({
                message: "Could not create appointment",
                success: false
            })
        }
        return res.status(201).json({
            message: "Successfully created appointment",
            status: true
        })

    } catch (error) {
        return res.status(501).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const getAppointments = async (req, res) => {
    try {
        // e.g. filter by user ID if not admin
        const userId = req.userId;
        const query = { created_by: userId };
        
        const appointments = await AppointmentService.getAppointments(query);
        return res.status(200).json({ data: appointments, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await AppointmentService.getAppointmentById(id);
        
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found", success: false });
        }
        
        return res.status(200).json({ data: appointment, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const updated = await AppointmentService.updateAppointment(id, data);
        
        if (!updated) {
            return res.status(404).json({ message: "Appointment not found", success: false });
        }
        
        return res.status(200).json({ message: "Appointment updated successfully", data: updated, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await AppointmentService.deleteAppointment(id);
        
        if (!deleted) {
            return res.status(404).json({ message: "Appointment not found", success: false });
        }
        
        return res.status(200).json({ message: "Appointment deleted successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}