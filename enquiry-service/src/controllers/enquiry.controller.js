import * as enquiryService from '../services/enquiry.service.js';

export const createEnquiry = async (req, res) => {
    try {
        const enquiry = await enquiryService.createEnquiry(req.body);
        res.status(201).json({
            success: true,
            message: 'Enquiry submitted successfully',
            data: enquiry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to submit enquiry'
        });
    }
};

export const getEnquiries = async (req, res) => {
    try {
        const result = await enquiryService.getEnquiries(req.query);
        res.status(200).json({
            success: true,
            data: result.enquiries,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch enquiries'
        });
    }
};

export const getEnquiryById = async (req, res) => {
    try {
        const { id } = req.params;
        const enquiry = await enquiryService.getEnquiryById(id);
        res.status(200).json({
            success: true,
            data: enquiry
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || 'Enquiry not found'
        });
    }
};

export const updateEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const token=req.headers.authorization.split(' ')[1]
        const updated = await enquiryService.updateEnquiry(id, req.body, userId,token);  
        
        res.status(200).json({
            success: true,
            message: 'Enquiry updated successfully',
            data: updated
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update enquiry'
        });
    }
};



export const updateStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const { status } = req.body;
        const { id } = req.params;
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

        const updated = await enquiryService.updateStatus(id, status, userId, token);
        if (!updated) {
            return res.status(400).json({
                message: "Could not update status",
                success: false
            });
        }

        return res.status(200).json({
            message: "Successfully updated status of enquiry",
            success: true,
            data: updated
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message || "Failed to update status",
            success: false
        });
    }
};
export const convertEnquiry = async (req, res) => {
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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to convert enquiry'
        });
    }
};



export const deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        await enquiryService.deleteEnquiry(id);
        res.status(200).json({
            success: true,
            message: 'Enquiry deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to delete enquiry'
        });
    }
};
