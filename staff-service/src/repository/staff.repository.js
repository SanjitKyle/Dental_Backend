import Staff from '../model/Staff.model.js';
import axios from 'axios'
import dotenv from 'dotenv';
dotenv.config()
export const create = async (data) => {
    const { fullName, email } = data;
    const AuthData = {
        name: fullName,
        email: email,
        role: "staff",
        password: "default123"
    }
    const authurl = process.env.AUTH_SERVICE_URL
    const authResponse = await axios.post(`${authurl}/register`, AuthData);
    if (!authResponse || !authResponse.data) {
        const error = new Error("Could not create auth profile");
        error.statusCode = 403;
        throw error;
    }

    const finalRes = {
        ...data,
        employeeuserId: authResponse.data._id || authResponse.data.data?._id
    }


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
