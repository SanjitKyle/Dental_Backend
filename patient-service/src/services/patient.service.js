import * as patientRepository from '../repository/patient.repository.js';

export const createProfile = async (data) => {
    // You could potentially check for duplicates by email or phone if needed,
    // but for now, we just create the patient.
    return await patientRepository.createPatient(data);
};

export const getProfile = async (id) => {
    const patient = await patientRepository.getPatientById(id);
    if (!patient) {
        throw new Error('Patient profile not found.');
    }
    return patient;
};

export const updateProfile = async (id, data) => {
    const patient = await patientRepository.updatePatient(id, data);
    if (!patient) {
        throw new Error('Patient profile not found.');
    }
    return patient;
};

export const getAllProfiles = async () => {
    return await patientRepository.getAllPatients();
};
