import * as staffRepository from '../repository/staff.repository.js';

export const createStaff = async (data,token) => {
    // Business logic or validation can be added here
    return await staffRepository.create(data,token);
};

export const getAllStaff = async ({limit, skip}) => {
    return await staffRepository.findAll({limit,skip});
};

export const getStaffById = async (id) => {
    const staff = await staffRepository.findById(id);
    if (!staff) {
        const error = new Error('Staff not found');
        error.statusCode = 404;
        throw error;
    }
    return staff;
};

export const updateStaff = async (id, data) => {
    const staff = await staffRepository.update(id, data);
    if (!staff) {
        const error = new Error('Staff not found');
        error.statusCode = 404;
        throw error;
    }
    return staff;
};

export const deleteStaff = async (id) => {
    const staff = await staffRepository.remove(id);
    if (!staff) {
        const error = new Error('Staff not found');
        error.statusCode = 404;
        throw error;
    }
    return staff;
};
