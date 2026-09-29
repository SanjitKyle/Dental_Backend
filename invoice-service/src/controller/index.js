import * as invoiceService from '../services/index.js';
import { enrichInvoicesWithProfiles } from '../utils/enrichProfiles.js';

// 1. CREATE INVOICE
export const createInvoice = async (req, res, next) => {
    try {
        const invoiceData = {
            ...req.body,
            createdBy: req.userId || req.body.createdBy
        };

        const newInvoice = await invoiceService.createInvoice(invoiceData);
        const enriched = await enrichInvoicesWithProfiles(newInvoice, req.headers.authorization);

        res.status(201).json({
            success: true,
            message: 'Invoice created successfully',
            data: enriched
        });
    } catch (err) {
        next(err);
    }
};

// 2. GET ALL INVOICES (With Pagination, Filters, and Enriched Patient/Doctor Profiles)
export const getAllInvoices = async (req, res, next) => {
    try {
        const {
            page: rawPage,
            limit: rawLimit,
            offset: rawOffset,
            status,
            patientId,
            doctorId,
            startDate,
            endDate
        } = req.query;

        const page = Math.max(1, parseInt(rawPage, 10) || 1);
        const limit = Math.max(1, parseInt(rawLimit, 10) || 10);
        const offset = rawOffset !== undefined ? Math.max(0, parseInt(rawOffset, 10) || 0) : (page - 1) * limit;

        // Build dynamic query
        const query = {};
        if (status) query.status = status;
        if (patientId) query.patientId = patientId;
        if (doctorId) query.doctorId = doctorId;

        // Date range query
        if (startDate || endDate) {
            query.invoiceDate = {};
            if (startDate) query.invoiceDate.$gte = new Date(startDate);
            if (endDate) query.invoiceDate.$lte = new Date(endDate);
        }

        const { invoices, total } = await invoiceService.getInvoices({ query, skip: offset, limit });

        // Enrich invoices with Patient & Doctor profiles across microservices
        const enrichedInvoices = await enrichInvoicesWithProfiles(invoices, req.headers.authorization);

        res.status(200).json({
            success: true,
            data: enrichedInvoices,
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
    } catch (err) {
        next(err);
    }
};

// 3. GET INVOICE BY ID (With Enriched Profiles)
export const getInvoiceById = async (req, res, next) => {
    try {
        const invoice = await invoiceService.getInvoiceById(req.params.id);
        const enriched = await enrichInvoicesWithProfiles(invoice, req.headers.authorization);

        res.status(200).json({
            success: true,
            data: enriched
        });
    } catch (err) {
        next(err);
    }
};

// 4. UPDATE INVOICE
export const updateInvoice = async (req, res, next) => {
    try {
        const updated = await invoiceService.updateInvoice(req.params.id, req.body);
        const enriched = await enrichInvoicesWithProfiles(updated, req.headers.authorization);

        res.status(200).json({
            success: true,
            message: 'Invoice updated successfully',
            data: enriched
        });
    } catch (err) {
        next(err);
    }
};

// 5. DELETE INVOICE
export const deleteInvoice = async (req, res, next) => {
    try {
        await invoiceService.deleteInvoice(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Invoice deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};