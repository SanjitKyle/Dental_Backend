import axios from 'axios';
import * as DoctorRepository from '../repository/doctor.repository.js';

export const createDoctor = async (doctorData) => {
    // 1. Create Auth Account first
    try {
        const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3000/api/auth';

        // We assume doctorData contains a 'password' field that the frontend sends
        const authPayload = {
            name: doctorData.full_name,
            email: doctorData.email,
            password: doctorData.password || "doctor123",
            role: 'doctor' // Assuming your auth service accepts a role
        };

        const authResponse = await axios.post(`${authUrl}/register`, authPayload);

        // Extract the generated userId from the auth response
        // (Depends on how your auth service sends it back, typically authResponse.data.user._id or authResponse.data._id)
        const newUserId = authResponse.data.data?._id || authResponse.data.user?._id || authResponse.data._id;

        if (!newUserId) {
            throw new Error("Auth service did not return a valid userId");
        }

        // 2. Attach the new userId to the doctor profile data and remove the password
        doctorData.userId = newUserId;
        delete doctorData.password;

        // 3. Save the Doctor Profile in our database
        return await DoctorRepository.createDoctor(doctorData);

    } catch (error) {
        console.error("Error communicating with Auth Service:", error.message);
        throw new Error("Failed to create Auth account for Doctor: " + (error.response?.data?.message || error.message));
    }
};

export const getAllDoctors = async (query) => {
    return await DoctorRepository.getAllDoctors(query);
};

export const getDoctorById = async (id) => {
    return await DoctorRepository.getDoctorById(id);
};

export const getDoctorFullProfile = async (userId) => {
    // 1. Fetch from Doctor Database
    const doctorInfo = await DoctorRepository.getDoctorByUserId(userId);
    if (!doctorInfo) {
        throw new Error("Doctor professional profile not found");
    }

    // 2. Fetch from Auth Service using internal API call
    let authInfo = null;
    try {
        const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3000/api/auth';
        const authResponse = await axios.get(`${authUrl}/users/${userId}`);
        authInfo = authResponse.data;
    } catch (authError) {
        console.error("Warning: Could not fetch from auth-service", authError.message);
    }

    // 3. Combine them
    return {
        ...doctorInfo._doc,
        auth_details: authInfo ? authInfo : "Auth details unavailable"
    };
};

export const updateDoctor = async (id, updateData) => {
    return await DoctorRepository.updateDoctor(id, updateData);
};

export const deleteDoctor = async (id) => {
    return await DoctorRepository.deleteDoctor(id);
};
