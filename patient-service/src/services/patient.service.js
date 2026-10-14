import * as patientRepository from '../repository/patient.repository.js';
import AppError from '../utils/AppError.js';

export const createProfile = async (data) => {
    return await patientRepository.createPatient(data);
};

export const getProfile = async (id, clinicId = null, role = null, userId = null) => {
    const patient = await patientRepository.getPatientById(id, clinicId, role, userId);
    if (!patient) {
        throw new AppError('Patient profile not found.', 404);
    }
    return patient;
};

export const updateProfile = async (id, data, clinicId = null, role = null, userId = null) => {
    const patient = await patientRepository.updatePatient(id, data, clinicId, role, userId);
    if (!patient) {
        throw new AppError('Patient profile not found.', 404);
    }
    return patient;
};

export const getAllProfiles = async ({ clinicId, userId, role, limit = 10, skip = 0 }) => {
    return await patientRepository.getAllPatients({ clinicId, userId, role, limit, skip });
};

export const deletePatientById = async (id, clinicId = null, role = null, userId = null) => {
    const response = await patientRepository.deletePatient(id, clinicId, role, userId);
    if (!response) {
        throw new AppError('Patient profile not found.', 404);
    }
    return response;
};
