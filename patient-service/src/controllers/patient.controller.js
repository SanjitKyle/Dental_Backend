import * as patientService from '../services/patient.service.js';
import catchAsync from '../utils/catchAsync.js';

export const createPatientProfile = catchAsync(async (req, res) => {
    const patientData = req.body;
    const created_by = req.userId;

    const newPatient = await patientService.createProfile({ ...patientData, created_by });
    res.status(201).json({
        success: true,
        message: 'Patient profile created successfully',
        data: newPatient
    });
});

export const getPatientProfile = catchAsync(async (req, res) => {
    const id = req.params.id;
    const patient = await patientService.getProfile(id);
    res.status(200).json({
        success: true,
        data: patient
    });
});

export const updatePatientProfile = catchAsync(async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    const updatedPatient = await patientService.updateProfile(id, updateData);
    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedPatient
    });
});

export const getAllPatients = catchAsync(async (req, res) => {
    const userId = req.userId;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const offset = req.query.offset !== undefined
        ? Math.max(0, parseInt(req.query.offset, 10) || 0)
        : (page - 1) * limit;

    const { patients, total } = await patientService.getAllProfiles({ userId, limit, skip: offset });
    res.status(200).json({
        success: true,
        data: patients,
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
});

export const DeletePatients = catchAsync(async (req, res) => {
    const id = req.params.id;
    await patientService.deletePatientById(id);
    res.status(200).json({
        success: true,
        message: 'Successfully deleted patient'
    });
});