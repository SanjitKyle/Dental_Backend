import * as staffService from '../services/staff.service.js';
import catchAsync from '../utils/catchAsync.js';

export const createStaff = catchAsync(async (req, res) => {
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : '';
    const userId = req.userId;
    const data = {
        ...req.body,
        createdBy: userId
    };
    const savedStaff = await staffService.createStaff(data, token);
    res.status(201).json({ success: true, data: savedStaff });
});

export const getStaff = catchAsync(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const offset = req.query.offset !== undefined
        ? Math.max(0, parseInt(req.query.offset, 10) || 0)
        : (page - 1) * limit;

    const { staffMembers, total } = await staffService.getAllStaff({ limit, skip: offset });
    res.status(200).json({
        success: true,
        data: staffMembers,
        pagination: {
            total,
            page,
            limit,
            offset,
            totalPages: Math.ceil(total / limit),
            hasNextPage: offset + limit < total,
            hasPrevPage: offset > 0 || page > 1
        }
    });
});

export const getStaffById = catchAsync(async (req, res) => {
    const staff = await staffService.getStaffById(req.params.id);
    res.status(200).json({ success: true, data: staff });
});

export const updateStaff = catchAsync(async (req, res) => {
    const staff = await staffService.updateStaff(req.params.id, req.body);
    res.status(200).json({ success: true, data: staff });
});

export const deleteStaff = catchAsync(async (req, res) => {
    await staffService.deleteStaff(req.params.id);
    res.status(200).json({ success: true, message: 'Staff deleted successfully' });
});
