import Patient from '../models/patient.js'; // Assuming Patient is exported as default from the model file
import axios from 'axios'
export const createPatient = async (patientData) => {
    const {email , full_name}=patientData;
    const existingPatient = await Patient.findOne({ email });
    if(existingPatient){
        throw new Error('Patient with this email already exists');
    }
    const response=await axios.post('https://dentalbackend.kyleinfotech.co.in/api/auth/register',{
        name:full_name,
        email:email,
        password:'defaultPassword123',
        role:'patient'
    });
    if(!response.data.success){
        throw new Error('Failed to create user in auth service');
    }
    const userId=response.data.data._id;
    const finalPatientData={...patientData,userId};
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
