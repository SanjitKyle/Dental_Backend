import * as prescriptionService from '../services/prescription.service.js';

export const createPrescription = async (req, res) => {
    try {
        const userId = req.userId;
        const prescription = await prescriptionService.createPrescription(req.body, userId);
        res.status(201).json({
            success: true,
            message: 'Prescription created successfully',
            data: prescription
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create prescription'
        });
    }
};

export const getPrescriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const prescription = await prescriptionService.getPrescriptionById(id);
        res.status(200).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || 'Prescription not found'
        });
    }
};

export const getPrescriptionByNumber = async (req, res) => {
    try {
        const { prescriptionNumber } = req.params;
        const prescription = await prescriptionService.getPrescriptionByNumber(prescriptionNumber);
        res.status(200).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || 'Prescription not found'
        });
    }
};

export const getPrescriptionsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { status } = req.query;
        const filters = status ? { status } : {};
        const prescriptions = await prescriptionService.getPrescriptionsByPatient(patientId, filters);
        res.status(200).json({
            success: true,
            data: prescriptions
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch prescriptions'
        });
    }
};

export const getPrescriptionsByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { status } = req.query;
        const filters = status ? { status } : {};
        const prescriptions = await prescriptionService.getPrescriptionsByDoctor(doctorId, filters);
        res.status(200).json({
            success: true,
            data: prescriptions
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch prescriptions'
        });
    }
};

export const getPrescriptionsByAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const prescriptions = await prescriptionService.getPrescriptionsByAppointment(appointmentId);
        res.status(200).json({
            success: true,
            data: prescriptions
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch prescriptions'
        });
    }
};

export const updatePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const updated = await prescriptionService.updatePrescription(id, req.body, userId);
        res.status(200).json({
            success: true,
            message: 'Prescription updated successfully',
            data: updated
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update prescription'
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.userId;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const updated = await prescriptionService.updatePrescriptionStatus(id, status, userId);
        res.status(200).json({
            success: true,
            message: `Prescription status updated to ${status}`,
            data: updated
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update status'
        });
    }
};

export const deletePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        await prescriptionService.deletePrescription(id);
        res.status(200).json({
            success: true,
            message: 'Prescription deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to delete prescription'
        });
    }
};
