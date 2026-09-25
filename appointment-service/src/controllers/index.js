// controllers entry point for appointment-service
import * as AppointmentService from '../services/index.js'
export const createAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const data = req.body;
        const finaldata = { ...data, created_by: userId };
        const created = await AppointmentService.createAppointment(finaldata);
        if (!created) {
            return res.status(500).json({
                message: "Could not create appointment",
                success: false
            });
        }
        return res.status(201).json({
            message: "Successfully created appointment",
            data: created,
            status: true
        });

    } catch (error) {
        // Concurrency Guard: Catch MongoDB E11000 Duplicate Key Error (Double Booking)
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This doctor is already booked for the selected date and time slot. Please choose another time.",
                success: false
            });
        }

        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
};

export const getAppointments = async (req, res) => {
    try {
        const userId = req.userId;
        const userRole = (req.userRole || '').toLowerCase();
        // 1. Separate pagination from extra filters (status, date, doctor, etc.)
        const { page: rawPage, limit: rawLimit, offset: rawOffset, all, ...filterQuery } = req.query;
        const page = Math.max(1, parseInt(rawPage, 10) || 1);
        const limit = Math.max(1, parseInt(rawLimit, 10) || 500);
        const offset = rawOffset !== undefined ? Math.max(0, parseInt(rawOffset, 10) || 0) : (page - 1) * limit;

        // Admins, Staff, and Doctors manage/view all clinic appointments.
        const isClinicStaff = userRole === 'admin' || userRole === 'staff' || userRole === 'doctor' || all === 'true';
        const query = isClinicStaff
            ? { ...filterQuery }
            : { created_by: userId, ...filterQuery };

        const { appointments, total } = await AppointmentService.getAppointments({
            query,
            skip: offset,
            limit
        });
        return res.status(200).json({
            success:true,
            data:appointments,
            paginations:{
                total,
                page,
                limit,
                offset,
                totalPages: Math.ceil(total/limit),
                hasNextPage:offset+limit<total ,
                hasPrevPage: page>1

            }
        });
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