import * as staffService from '../services/staff.service.js';

export const createStaff = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const userId = req.userId;
        const data = {
            ...req.body,
            createdBy: userId

        }
        const savedStaff = await staffService.createStaff(data, token);
        res.status(201).json({ success: true, data: savedStaff });
    } catch (error) {
        const statusCode = error.statusCode || 400;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};

export const getStaff = async (req, res) => {
    try {
        const page=Math.max(1,parseInt(req.query.page,10)||1);
        const limit=Math.max(1, parseInt(req.query.limit,10)||10);
const offset = req.query.offset !== undefined 
    ? Math.max(0, parseInt(req.query.offset, 10) || 0) 
    : (page - 1) * limit;

        const {staffMembers,total} = await staffService.getAllStaff({limit,skip:offset});
        res.status(200).json({ 
            success:true,
            data:staffMembers,
            total,
            page,
            offset,
            hasNextPage:offset+limit<total,
            hasPrevPage: page>1
         });
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
