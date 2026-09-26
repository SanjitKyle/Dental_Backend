import * as patientService from '../services/patient.service.js';

export const createPatientProfile = async (req, res) => {
    try {
        const patientData = req.body;
        const created_by = req.userId;

        const newPatient = await patientService.createProfile({ ...patientData, created_by });
        res.status(201).json({ message: 'Patient profile created successfully', data: newPatient });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Error creating profile' });
    }
};

export const getPatientProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const patient = await patientService.getProfile(id);
        res.status(200).json({ data: patient });
    } catch (error) {
        res.status(404).json({ message: error.message || 'Profile not found' });
    }
};

export const updatePatientProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        const updatedPatient = await patientService.updateProfile(id, updateData);
        res.status(200).json({ message: 'Profile updated successfully', data: updatedPatient });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Error updating profile' });
    }
};

export const getAllPatients = async (req, res) => {
    try {
        const userId = req.userId;
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
        const offset = req.query.offset !== undefined ? parseInt(req.query.offset, 10) : (page - 1) * limit
        const { patients, total } = await patientService.getAllProfiles({ userId, limit, skip: offset });
        res.status(200).json({
            success: true,
            data: patients,
            paginations: {
                total,
                page,
                limit,
                offset,
                totalPages: Math.ceil(total / limit),
                hasNextpage: offset + limit < total,
                hasPrevPage: page > 1

            }

        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

export const DeletePatients = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await patientService.deletePatientById(id);
        if (!response) {
            return res.status(403).json({
                message: "Could not delete patients",
                success: false
            })
        }
        return res.status(200).json({
            message: "Successfully delete patients",
            success: true
        })


    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error
        })
    }
}