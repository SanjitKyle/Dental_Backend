import * as enquiryService from '../services/enquiry.service.js';
import catchAsync from '../utils/catchAsync.js';

export const createEnquiry = catchAsync(async (req, res) => {
    const enquiry = await enquiryService.createEnquiry(req.body);
    res.status(201).json({
        success: true,
        message: 'Enquiry submitted successfully',
        data: enquiry
    });
});

export const getEnquiries = catchAsync(async (req, res) => {
    const result = await enquiryService.getEnquiries(req.query);
    res.status(200).json({
        success: true,
        data: result.enquiries,
        pagination: result.pagination
    });
});

export const getEnquiryById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const enquiry = await enquiryService.getEnquiryById(id);
    res.status(200).json({
        success: true,
        data: enquiry
    });
});

export const updateEnquiry = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
    const updated = await enquiryService.updateEnquiry(id, req.body, userId, token);

    res.status(200).json({
        success: true,
        message: 'Enquiry updated successfully',
        data: updated
    });
});

export const updateStatus = catchAsync(async (req, res) => {
    const userId = req.userId;
    const { status } = req.body;
    const { id } = req.params;
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

    const updated = await enquiryService.updateStatus(id, status, userId, token);
    res.status(200).json({
        success: true,
        message: "Successfully updated status of enquiry",
        data: updated
    });
});

export const convertEnquiry = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

    const updated = await enquiryService.convertEnquiry(id, req.body, userId, token);
    res.status(200).json({
        success: true,
        message: 'Enquiry marked as Converted',
        data: updated
    });
});

export const deleteEnquiry = catchAsync(async (req, res) => {
    const { id } = req.params;
    await enquiryService.deleteEnquiry(id);
    res.status(200).json({
        success: true,
        message: 'Enquiry deleted successfully'
    });
});
