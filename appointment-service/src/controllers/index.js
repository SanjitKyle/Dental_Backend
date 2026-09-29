import * as AppointmentService from '../services/index.js';

export const createAppointment = async (req, res, next) => {
    try {
        const userId = req.userId;
        const data = req.body;
        const finaldata = { ...data, created_by: userId };
        const created = await AppointmentService.createAppointment(finaldata);

        res.status(201).json({
            success: true,
            message: "Successfully created appointment",
            data: created
        });
    } catch (err) {
        next(err);
    }
};

export const getAppointments = async (req, res, next) => {
    try {
        const userId = req.userId;
        const userRole = (req.userRole || '').toLowerCase();
        const { page: rawPage, limit: rawLimit, offset: rawOffset, all, ...filterQuery } = req.query;

        const page = Math.max(1, parseInt(rawPage, 10) || 1);
        const limit = Math.max(1, parseInt(rawLimit, 10) || 500);
        const offset = rawOffset !== undefined ? Math.max(0, parseInt(rawOffset, 10) || 0) : (page - 1) * limit;

        const isClinicStaff = userRole === 'admin' || userRole === 'staff' || userRole === 'doctor' || all === 'true';
        const query = isClinicStaff
            ? { ...filterQuery }
            : { created_by: userId, ...filterQuery };

        const { appointments, total } = await AppointmentService.getAppointments({
            query,
            skip: offset,
            limit
        });

        res.status(200).json({
            success: true,
            data: appointments,
            pagination: {
                total,
                page,
                limit,
                offset,
                totalPages: Math.ceil(total / limit),
                hasNextPage: offset + limit < total,
                hasPrevPage: offset > 0 || page > 1
            }
        });
    } catch (err) {
        next(err);
    }
};

export const getAppointmentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const appointment = await AppointmentService.getAppointmentById(id);
        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        next(err);
    }
};

export const updateAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = await AppointmentService.updateAppointment(id, data);

        res.status(200).json({
            success: true,
            message: "Appointment updated successfully",
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

export const deleteAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        await AppointmentService.deleteAppointment(id);

        res.status(200).json({
            success: true,
            message: "Appointment deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};