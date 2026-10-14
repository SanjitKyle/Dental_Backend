import * as AppointmentService from '../services/index.js';

export const createAppointment = async (req, res, next) => {
    try {
        const userId = req.userId;
        const clinicId = req.clinicId || req.body.clinicId || null;
        const clinicName = req.clinicName || req.body.clinicName || null;
        const data = req.body;
        const finaldata = { ...data, created_by: userId, clinicId, clinicName };
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
        const userRole = (req.userRole || req.role || '').toLowerCase();
        const clinicId = req.clinicId || req.query.clinicId || null;
        const { page: rawPage, limit: rawLimit, offset: rawOffset, all, ...filterQuery } = req.query;

        const page = Math.max(1, parseInt(rawPage, 10) || 1);
        const limit = Math.max(1, parseInt(rawLimit, 10) || 500);
        const offset = rawOffset !== undefined ? Math.max(0, parseInt(rawOffset, 10) || 0) : (page - 1) * limit;

        let query = {};
        if (userRole === 'super_admin') {
            query = clinicId ? { clinicId, ...filterQuery } : { ...filterQuery };
        } else if (clinicId) {
            query = {
                $and: [
                    { $or: [{ clinicId: String(clinicId) }, { created_by: String(userId) }] },
                    filterQuery
                ]
            };
        } else {
            query = { created_by: userId, ...filterQuery };
        }

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
        
        if (appointment && req.clinicId && req.role !== 'super_admin' && appointment.clinicId && appointment.clinicId !== String(req.clinicId)) {
            return res.status(403).json({ success: false, message: "Forbidden: Cannot access appointment from another clinic" });
        }

        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        next(err);
    }
};

export const updateAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await AppointmentService.getAppointmentById(id);
        if (existing && req.clinicId && req.role !== 'super_admin' && existing.clinicId && existing.clinicId !== String(req.clinicId)) {
            return res.status(403).json({ success: false, message: "Forbidden: Cannot update appointment from another clinic" });
        }

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
        const existing = await AppointmentService.getAppointmentById(id);
        if (existing && req.clinicId && req.role !== 'super_admin' && existing.clinicId && existing.clinicId !== String(req.clinicId)) {
            return res.status(403).json({ success: false, message: "Forbidden: Cannot delete appointment from another clinic" });
        }

        await AppointmentService.deleteAppointment(id);

        res.status(200).json({
            success: true,
            message: "Appointment deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};