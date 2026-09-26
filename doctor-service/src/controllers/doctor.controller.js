import * as DoctorService from '../services/doctor.service.js';
import catchAsync from '../utils/catchAsync.js';

// Create a new Doctor Profile
export const createDoctor = catchAsync(async (req, res) => {
    const doctorData = req.body;
    const newDoctor = await DoctorService.createDoctor(doctorData);
    res.status(201).json({
        success: true,
        message: "Doctor profile created successfully",
        data: newDoctor
    });
});

// Get all Doctors (with pagination and filters)
export const getAllDoctors = catchAsync(async (req, res) => {
    const { page: rawPage, limit: rawLimit, offset: rawOffset, ...filterQuery } = req.query;
    const page = Math.max(1, parseInt(rawPage, 10) || 1);
    const limit = Math.max(1, parseInt(rawLimit, 10) || 10);
    const offset = rawOffset !== undefined ? Math.max(0, parseInt(rawOffset, 10) || 0) : (page - 1) * limit;

    const { doctors, total } = await DoctorService.getAllDoctors({ query: filterQuery, limit, skip: offset });
    res.status(200).json({
        success: true,
        data: doctors,
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

// Get a specific Doctor Profile by ID
export const getDoctorById = catchAsync(async (req, res) => {
    const doctor = await DoctorService.getDoctorById(req.params.id);
    res.status(200).json({ success: true, data: doctor });
});

// Get Doctor Full Profile (Doctor DB + Auth DB)
export const getDoctorFullProfile = catchAsync(async (req, res) => {
    const fullProfile = await DoctorService.getDoctorFullProfile(req.params.userId);
    res.status(200).json({ success: true, data: fullProfile });
});

// Update Doctor Profile
export const updateDoctor = catchAsync(async (req, res) => {
    const updatedDoctor = await DoctorService.updateDoctor(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: "Doctor updated successfully",
        data: updatedDoctor
    });
});

// Delete Doctor
export const deleteDoctor = catchAsync(async (req, res) => {
    await DoctorService.deleteDoctor(req.params.id);
    res.status(200).json({
        success: true,
        message: "Doctor deleted successfully"
    });
});
