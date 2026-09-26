import axios from 'axios';
import * as prescriptionService from '../services/prescription.service.js';

export const createPrescription = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { patientId, doctorId, followUpDate, followUpInstructions } = req.body;

        const prescription = await prescriptionService.createPrescription(req.body, userId);

        if (followUpDate) {
            try {
                const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
                const appointmentData = {
                    patient: patientId,
                    doctor: doctorId,
                    date: followUpDate,
                    status: 'Follow-up',
                    visit_type: 'Follow-up',
                    created_by: userId,
                    reasonForVisit: followUpInstructions || 'Follow-up visit',
                };

                const appointmentServiceUrl = process.env.APPOINTMENT_SERVICE_URL || 'http://127.0.0.1:5003/api/appointments';
                await axios.post(appointmentServiceUrl, appointmentData, {
                    headers: { authorization: `Bearer ${token}` }
                });
            } catch (apptErr) {
                console.warn('Follow-up appointment auto-creation failed, but prescription was created:', apptErr.message);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Prescription created successfully',
            data: prescription
        });
    } catch (err) {
        next(err);
    }
};

export const getAllPrescriptions = async (req, res, next) => {
    try {
        const result = await prescriptionService.getAllPrescriptions(req.query);
        res.status(200).json({
            success: true,
            data: result.prescriptions,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                offset: result.offset,
                totalPages: result.totalPages,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            }
        });
    } catch (err) {
        next(err);
    }
};

export const getPrescriptionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const prescription = await prescriptionService.getPrescriptionById(id);
        res.status(200).json({ success: true, data: prescription });
    } catch (err) {
        next(err);
    }
};

export const getPrescriptionByNumber = async (req, res, next) => {
    try {
        const { prescriptionNumber } = req.params;
        const prescription = await prescriptionService.getPrescriptionByNumber(prescriptionNumber);
        res.status(200).json({ success: true, data: prescription });
    } catch (err) {
        next(err);
    }
};

export const getPrescriptionsByPatient = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const { status } = req.query;
        const filters = status ? { status } : {};
        const prescriptions = await prescriptionService.getPrescriptionsByPatient(patientId, filters);
        res.status(200).json({ success: true, data: prescriptions });
    } catch (err) {
        next(err);
    }
};

export const getPrescriptionsByDoctor = async (req, res, next) => {
    try {
        const { doctorId } = req.params;
        const { status } = req.query;
        const filters = status ? { status } : {};
        const prescriptions = await prescriptionService.getPrescriptionsByDoctor(doctorId, filters);
        res.status(200).json({ success: true, data: prescriptions });
    } catch (err) {
        next(err);
    }
};

export const getPrescriptionsByAppointment = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;
        const prescriptions = await prescriptionService.getPrescriptionsByAppointment(appointmentId);
        res.status(200).json({ success: true, data: prescriptions });
    } catch (err) {
        next(err);
    }
};

export const updatePrescription = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const updated = await prescriptionService.updatePrescription(id, req.body, userId);
        res.status(200).json({
            success: true,
            message: 'Prescription updated successfully',
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

export const updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.userId;

        const updated = await prescriptionService.updatePrescriptionStatus(id, status, userId);
        res.status(200).json({
            success: true,
            message: `Prescription status updated to ${status}`,
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

export const deletePrescription = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prescriptionService.deletePrescription(id);
        res.status(200).json({
            success: true,
            message: 'Prescription deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
