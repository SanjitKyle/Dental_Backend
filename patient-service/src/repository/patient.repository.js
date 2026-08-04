import Patient from '../models/patient.js'; // Assuming Patient is exported as default from the model file

export const createPatient = async (patientData) => {
    const patient = new Patient(patientData);
    return await patient.save();
};

export const getPatientById = async (id) => {
    return await Patient.findById(id);
};

export const updatePatient = async (id, updateData) => {
    return await Patient.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );
};

export const getAllPatients = async () => {
    return await Patient.find();
};
