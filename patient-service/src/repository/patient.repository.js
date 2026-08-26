import Patient from '../models/patient.js'; // Assuming Patient is exported as default from the model file
import axios from 'axios'
export const createPatient = async (patientData) => {
    const {email , full_name}=patientData;
    if (!email) {
        throw new Error('Email is required to create a patient profile');
    }
    const existingPatient = await Patient.findOne({ email });
    if(existingPatient){
        throw new Error('Patient with this email already exists');
    }
    
    let userId;
    try {
        const authUrl = process.env.AUTH_SERVICE_URL || 'https://dental-backend-jekw.onrender.com/api/auth';
        const response=await axios.post(`${authUrl}/register`,{
            name:full_name,
            email:email,
            password:'defaultPassword123',
            role:'patient'
        });
        
        if(!response.data.success){
            throw new Error('Failed to create user in auth service');
        }
        userId = response.data.data._id || response.data.data.id || response.data._id;
        
        if (!userId) {
            throw new Error('Auth service did not return a valid userId');
        }
    } catch (error) {
        console.error("Error communicating with Auth Service:", error.message);
        throw new Error("Failed to create Auth account for Patient: " + (error.response?.data?.message || error.message));
    }

    const finalPatientData={...patientData, userId};
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

export const getAllPatients = async (createdId) => {
    return await Patient.find({created_by:createdId});
};
