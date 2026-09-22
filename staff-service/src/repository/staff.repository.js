import Staff from '../model/Staff.model.js';
import axios from 'axios'
import dotenv from 'dotenv';
dotenv.config()
export const create = async (data, token) => {
    const { fullName, email } = data;
    const AuthData = {
        name: fullName,
        email: email,
        role: "staff",
        password: "default123"
    };

    const authurl = process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:5001/api/auth';
    let authResponse;
    try {
        authResponse = await axios.post(`${authurl}/register`, AuthData, {
            headers: token ? { authorization: `Bearer ${token}` } : {}
        });
    } catch (authError) {
        console.error("Error communicating with Auth Service:", authError.message);
        const errorMsg = authError.response?.data?.message || authError.message || "Could not create auth profile";
        const error = new Error("Failed to create Auth account for Staff: " + errorMsg);
        error.statusCode = authError.response?.status || 400;
        throw error;
    }

    const userId = authResponse.data?.data?._id || authResponse.data?.user?._id || authResponse.data?._id;
    if (!userId) {
        const error = new Error("Auth service did not return a valid userId");
        error.statusCode = 403;
        throw error;
    }

    const finalRes = {
        ...data,
        employeeuserId: userId
    };

    return await Staff.create(finalRes);
};
export const findAll = async () => {
    return await Staff.find();
};
export const findById = async (id) => {
    return await Staff.findById(id);
};
export const update = async (id, data) => {
    return await Staff.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};
export const remove = async (id) => {
    return await Staff.findByIdAndDelete(id);
};
