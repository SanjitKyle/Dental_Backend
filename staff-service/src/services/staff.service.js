import * as staffRepository from '../repository/staff.repository.js';
import AppError from '../utils/AppError.js';

export const createStaff = async (data, token) => {
    return await staffRepository.create(data, token);
};

export const getAllStaff = async ({ limit, skip }) => {
    return await staffRepository.findAll({ limit, skip });
};

export const getStaffById = async (id) => {
    const staff = await staffRepository.findById(id);
    if (!staff) {
        throw new AppError('Staff member not found', 404);
    }
    return staff;
};

export const updateStaff = async (id, data) => {
    const staff = await staffRepository.update(id, data);
    if (!staff) {
        throw new AppError('Staff member not found', 404);
    }
    return staff;
};

export const deleteStaff = async (id) => {
    const staff = await staffRepository.remove(id);
    if (!staff) {
        throw new AppError('Staff member not found', 404);
    }
    return staff;
};
