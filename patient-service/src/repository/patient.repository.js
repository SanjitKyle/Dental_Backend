import Patient from '../models/patient.js'; // Assuming Patient is exported as default from the model file
import axios from 'axios'
export const createPatient = async (patientData) => {
    const { email, full_name } = patientData;
    const cleanEmail = email && email.trim() ? email.trim().toLowerCase() : `patient_${Date.now()}_${Math.floor(Math.random() * 1000)}@clinic.local`;

    if (email && email.trim()) {
        const existingPatient = await Patient.findOne({ email: cleanEmail });
        if (existingPatient) {
            throw new Error('Patient with this email already exists');
        }
    }

    let userId;
    try {
        const authUrl = process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:5001/api/auth';
        const response = await axios.post(`${authUrl}/register`, {
            name: full_name,
            email: cleanEmail,
            password: 'defaultPassword123',
            role: 'patient'
        });

        if (!response.data?.success && !response.data?.data) {
            throw new Error('Failed to create user in auth service');
        }
        userId = response.data.data?._id || response.data.data?.id || response.data?._id;

        if (!userId) {
            throw new Error('Auth service did not return a valid userId');
        }
    } catch (error) {
        console.error("Error communicating with Auth Service:", error.message);
        throw new Error("Failed to create Auth account for Patient: " + (error.response?.data?.message || error.message));
    }

    const finalPatientData = { ...patientData, email: cleanEmail, userId };
    const patient = new Patient(finalPatientData);
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

export const getAllPatients = async ({ userId, limit, skip }) => {
    try {
        const [patients, total] = await Promise.all([
            Patient.find({ created_by: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Patient.countDocuments({ created_by: userId })

        ])
        return { patients, total }
    }
    catch (error) {
        throw error
    }
};
export const deletePatient = async (id) => {
    try {
        const res = await Patient.findByIdAndDelete(id);
        return res;

    } catch (error) {
        throw error;
    }
}
