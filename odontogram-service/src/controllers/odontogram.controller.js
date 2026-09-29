import * as odontogramService from '../services/odontogram.service.js';
import AppError from '../utils/AppError.js';

export const getAllOdontograms = async (req, res, next) => {
    try {
        const result = await odontogramService.getAllOdontograms(req.query);
        res.status(200).json({
            success: true,
            data: result.odontograms,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                offset: result.offset,
                totalPages: result.totalPages,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            }
        });
    } catch (err) {
        next(err);
    }
};

export const getPatientOdontogram = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const { dentitionType, doctorId } = req.query;
        const userId = req.userId;

        const odontogram = await odontogramService.getOrCreatePatientOdontogram(patientId, {
            dentitionType,
            doctorId,
            userId
        });

        res.status(200).json({
            success: true,
            message: 'Odontogram retrieved successfully',
            data: odontogram
        });
    } catch (err) {
        next(err);
    }
};

export const createOdontogram = async (req, res, next) => {
    try {
        const userId = req.userId;
        const newOdontogram = await odontogramService.createOdontogram(req.body, userId);

        res.status(201).json({
            success: true,
            message: 'Odontogram created successfully',
            data: newOdontogram
        });
    } catch (err) {
        next(err);
    }
};

export const updatePatientOdontogram = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const userId = req.userId;

        const updated = await odontogramService.updatePatientOdontogram(patientId, req.body, userId);
        res.status(200).json({
            success: true,
            message: 'Odontogram updated successfully',
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

export const updateTooth = async (req, res, next) => {
    try {
        const { patientId, toothNumber } = req.params;
        const userId = req.userId;

        const updated = await odontogramService.updateTooth(patientId, toothNumber, req.body, userId);
        res.status(200).json({
            success: true,
            message: `Tooth ${toothNumber} updated successfully`,
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

export const addProcedure = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const { toothNumber, ...procedureData } = req.body;
        const toothNum = toothNumber || req.params.toothNumber;

        if (!toothNum) {
            return next(new AppError('toothNumber is required', 400));
        }

        const userId = req.userId;
        const updated = await odontogramService.addProcedure(patientId, toothNum, procedureData, userId);

        res.status(200).json({
            success: true,
            message: 'Procedure added successfully',
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

export const resetTooth = async (req, res, next) => {
    try {
        const { patientId, toothNumber } = req.params;
        const userId = req.userId;

        const updated = await odontogramService.resetTooth(patientId, toothNumber, userId);
        res.status(200).json({
            success: true,
            message: `Tooth ${toothNumber} reset to sound condition`,
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

export const getSummary = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const summary = await odontogramService.getSummaryStatistics(patientId);

        res.status(200).json({
            success: true,
            message: 'Odontogram summary retrieved successfully',
            data: summary
        });
    } catch (err) {
        next(err);
    }
};

export const getHistory = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const history = await odontogramService.getAuditHistory(patientId);

        res.status(200).json({
            success: true,
            message: 'Odontogram audit history retrieved successfully',
            data: history
        });
    } catch (err) {
        next(err);
    }
};
