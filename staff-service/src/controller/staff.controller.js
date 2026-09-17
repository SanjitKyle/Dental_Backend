import * as staffService from '../services/staff.service.js';

export const createStaff = async (req, res) => {
    try {
        const savedStaff = await staffService.createStaff(req.body);
        res.status(201).json({ success: true, data: savedStaff });
    } catch (error) {
        const statusCode = error.statusCode || 400;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};

export const getStaff = async (req, res) => {
    try {
        const staffMembers = await staffService.getAllStaff();
        res.status(200).json({ success: true, data: staffMembers });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};

export const getStaffById = async (req, res) => {
    try {
        const staff = await staffService.getStaffById(req.params.id);
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};

export const updateStaff = async (req, res) => {
    try {
        const staff = await staffService.updateStaff(req.params.id, req.body);
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        const statusCode = error.statusCode || 400;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};

export const deleteStaff = async (req, res) => {
    try {
        await staffService.deleteStaff(req.params.id);
        res.status(200).json({ success: true, message: 'Staff deleted successfully' });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};
