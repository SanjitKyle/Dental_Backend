import * as patientRepository from '../repository/patient.repository.js';
import AppError from '../utils/AppError.js';

export const createProfile = async (data) => {
    return await patientRepository.createPatient(data);
};

export const getProfile = async (id) => {
    const patient = await patientRepository.getPatientById(id);
    if (!patient) {
        throw new AppError('Patient profile not found.', 404);
    }
    return patient;
};

export const updateProfile = async (id, data) => {
    const patient = await patientRepository.updatePatient(id, data);
    if (!patient) {
        throw new AppError('Patient profile not found.', 404);
    }
    return patient;
};

export const getAllProfiles = async ({ userId, limit = 10, skip = 0 }) => {
    return await patientRepository.getAllPatients({ userId, limit, skip });
};

export const deletePatientById = async (id) => {
    const response = await patientRepository.deletePatient(id);
    if (!response) {
        throw new AppError('Patient profile not found.', 404);
    }
    return response;
};
