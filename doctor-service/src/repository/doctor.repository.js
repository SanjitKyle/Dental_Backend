import Doctor from '../models/doctor.js';

export const createDoctor = async (doctorData) => {
    const doctor = new Doctor(doctorData);
    return await doctor.save();
};

export const getDoctorById = async (id) => {
    return await Doctor.findById(id);
};

export const getDoctorByUserId = async (userId) => {
    return await Doctor.findOne({ userId });
};

export const getAllDoctors = async (query = {}) => {
    return await Doctor.find(query);
};

export const updateDoctor = async (id, updateData) => {
    return await Doctor.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
};

export const deleteDoctor = async (id) => {
    return await Doctor.findByIdAndDelete(id);
};
