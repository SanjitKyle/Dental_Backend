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
            role: 'patient',
            clinicId: patientData.clinicId || null,
            clinicName: patientData.clinicName || null
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

    const finalPatientData = { 
        ...patientData, 
        email: cleanEmail, 
        userId,
        clinicId: patientData.clinicId || null,
        clinicName: patientData.clinicName || null
    };
    const patient = new Patient(finalPatientData);
    return await patient.save();
};

export const getPatientById = async (id, clinicId = null, role = null, userId = null) => {
    const patient = await Patient.findById(id);
    if (!patient) return null;
    if (role === 'super_admin') return patient;
    if (clinicId && patient.clinicId && patient.clinicId !== String(clinicId)) {
        return null; // Tenant isolation: cannot access other clinic's patient
    }
    return patient;
};

export const updatePatient = async (id, updateData, clinicId = null, role = null, userId = null) => {
    const existing = await getPatientById(id, clinicId, role, userId);
    if (!existing) return null;

    return await Patient.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );
};

export const getAllPatients = async ({ clinicId, userId, role, limit, skip }) => {
    try {
        let filter = {};
        if (role === 'super_admin') {
            if (clinicId) filter = { clinicId: String(clinicId) };
        } else if (clinicId) {
            filter = { clinicId: String(clinicId) };
        } else {
            filter = { clinicId: '__unauthorized_no_clinic__' };
        }

        const [patients, total] = await Promise.all([
            Patient.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Patient.countDocuments(filter)
        ]);
        return { patients, total };
    }
    catch (error) {
        throw error;
    }
};

export const deletePatient = async (id, clinicId = null, role = null, userId = null) => {
    try {
        const existing = await getPatientById(id, clinicId, role, userId);
        if (!existing) return null;
        return await Patient.findByIdAndDelete(id);
    } catch (error) {
        throw error;
    }
};
