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
        const userId=req.userId;
        const patients = await patientService.getAllProfiles(userId);
        res.status(200).json({ data: patients });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
