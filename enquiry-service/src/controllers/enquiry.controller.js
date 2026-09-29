import * as enquiryService from '../services/enquiry.service.js';

export const createEnquiry = async (req, res, next) => {
    try {
        const enquiry = await enquiryService.createEnquiry(req.body);
        res.status(201).json({
            success: true,
            message: 'Enquiry submitted successfully',
            data: enquiry
        });
    } catch (err) {
        next(err);
    }
};

export const getEnquiries = async (req, res, next) => {
    try {
        const result = await enquiryService.getEnquiries(req.query);
        res.status(200).json({
            success: true,
            data: result.enquiries,
            pagination: result.pagination
        });
    } catch (err) {
        next(err);
    }
};

export const getEnquiryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const enquiry = await enquiryService.getEnquiryById(id);
        res.status(200).json({
            success: true,
            data: enquiry
        });
    } catch (err) {
        next(err);
    }
};

export const updateEnquiry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
        const updated = await enquiryService.updateEnquiry(id, req.body, userId, token);

        res.status(200).json({
            success: true,
            message: 'Enquiry updated successfully',
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

export const updateStatus = async (req, res, next) => {
    try {
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
    } catch (err) {
        next(err);
    }
};

export const convertEnquiry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

        const updated = await enquiryService.convertEnquiry(id, req.body, userId, token);
        res.status(200).json({
            success: true,
            message: 'Enquiry marked as Converted',
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

export const deleteEnquiry = async (req, res, next) => {
    try {
        const { id } = req.params;
        await enquiryService.deleteEnquiry(id);
        res.status(200).json({
            success: true,
            message: 'Enquiry deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
