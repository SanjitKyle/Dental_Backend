import axios from 'axios';
import * as DoctorRepository from '../repository/doctor.repository.js';
import AppError from '../utils/AppError.js';

export const createDoctor = async (doctorData) => {
    // 1. Create Auth Account first
    try {
        const authUrl = process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:5001/api/auth';

        const authPayload = {
            name: doctorData.full_name,
            email: doctorData.email,
            password: doctorData.password || "doctor123",
            role: 'doctor'
        };

        const authResponse = await axios.post(`${authUrl}/register`, authPayload);
        const newUserId = authResponse.data?.data?._id || authResponse.data?.user?._id || authResponse.data?._id;

        if (!newUserId) {
            throw new AppError("Auth service did not return a valid userId", 502);
        }

        // 2. Attach the new userId to the doctor profile data and remove the password
        doctorData.userId = newUserId;
        delete doctorData.password;

        if (!doctorData.qualifications || !doctorData.qualifications.length) {
            doctorData.qualifications = ["BDS"];
        }
        if (doctorData.experience_years !== undefined && doctorData.experience_years !== '') {
            doctorData.experience_years = Number(doctorData.experience_years) || 0;
        } else {
            doctorData.experience_years = 0;
        }
        if (doctorData.consultation_fee !== undefined && doctorData.consultation_fee !== '') {
            doctorData.consultation_fee = Number(doctorData.consultation_fee) || 0;
        }

        // 3. Save the Doctor Profile
        return await DoctorRepository.createDoctor(doctorData);

    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error("Error communicating with Auth Service:", error.message);
        const msg = error.response?.data?.message || error.message || "Failed to create Auth account";
        throw new AppError("Failed to create Auth account for Doctor: " + msg, error.response?.status || 400);
    }
};

export const getAllDoctors = async ({ query, limit = 10, skip = 0 }) => {
    const { doctors, total } = await DoctorRepository.getAllDoctors({ query, limit, skip });
    return { doctors, total };
};

export const getDoctorById = async (id) => {
    const doctor = await DoctorRepository.getDoctorById(id);
    if (!doctor) {
        throw new AppError("Doctor not found", 404);
    }
    return doctor;
};

export const getDoctorFullProfile = async (userId) => {
    const doctorInfo = await DoctorRepository.getDoctorByUserId(userId);
    if (!doctorInfo) {
        throw new AppError("Doctor professional profile not found", 404);
    }

    let authInfo = null;
    try {
        const authUrl = process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:5001/api/auth';
        const authResponse = await axios.get(`${authUrl}/users/${userId}`);
        authInfo = authResponse.data;
    } catch (authError) {
        console.error("Warning: Could not fetch from auth-service", authError.message);
    }

    return {
        ...doctorInfo._doc,
        auth_details: authInfo ? authInfo : "Auth details unavailable"
    };
};

export const updateDoctor = async (id, updateData) => {
    const updated = await DoctorRepository.updateDoctor(id, updateData);
    if (!updated) {
        throw new AppError("Doctor not found", 404);
    }
    return updated;
};

export const deleteDoctor = async (id) => {
    const deleted = await DoctorRepository.deleteDoctor(id);
    if (!deleted) {
        throw new AppError("Doctor not found", 404);
    }
    return deleted;
};
