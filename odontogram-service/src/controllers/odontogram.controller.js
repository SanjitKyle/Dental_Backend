import * as odontogramService from '../services/odontogram.service.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllOdontograms = catchAsync(async (req, res) => {
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
});

export const getPatientOdontogram = catchAsync(async (req, res) => {
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
});

export const createOdontogram = catchAsync(async (req, res) => {
    const userId = req.userId;
    const newOdontogram = await odontogramService.createOdontogram(req.body, userId);

    res.status(201).json({
        success: true,
        message: 'Odontogram created successfully',
        data: newOdontogram
    });
});

export const updatePatientOdontogram = catchAsync(async (req, res) => {
    const { patientId } = req.params;
    const userId = req.userId;

    const updated = await odontogramService.updatePatientOdontogram(patientId, req.body, userId);
    res.status(200).json({
        success: true,
        message: 'Odontogram updated successfully',
        data: updated
    });
});

export const updateTooth = catchAsync(async (req, res) => {
    const { patientId, toothNumber } = req.params;
    const userId = req.userId;

    const updated = await odontogramService.updateTooth(patientId, toothNumber, req.body, userId);
    res.status(200).json({
        success: true,
        message: `Tooth ${toothNumber} updated successfully`,
        data: updated
    });
});

export const addProcedure = catchAsync(async (req, res) => {
    const { patientId } = req.params;
    const { toothNumber, ...procedureData } = req.body;
    const toothNum = toothNumber || req.params.toothNumber;

    if (!toothNum) {
        return res.status(400).json({
            success: false,
            message: 'toothNumber is required'
        });
    }

    const userId = req.userId;
    const updated = await odontogramService.addProcedure(patientId, toothNum, procedureData, userId);

    res.status(200).json({
        success: true,
        message: 'Procedure added successfully',
        data: updated
    });
});

export const resetTooth = catchAsync(async (req, res) => {
    const { patientId, toothNumber } = req.params;
    const userId = req.userId;

    const updated = await odontogramService.resetTooth(patientId, toothNumber, userId);
    res.status(200).json({
        success: true,
        message: `Tooth ${toothNumber} reset to sound condition`,
        data: updated
    });
});

export const getSummary = catchAsync(async (req, res) => {
    const { patientId } = req.params;
    const summary = await odontogramService.getSummaryStatistics(patientId);

    res.status(200).json({
        success: true,
        message: 'Odontogram summary retrieved successfully',
        data: summary
    });
});

export const getHistory = catchAsync(async (req, res) => {
    const { patientId } = req.params;
    const history = await odontogramService.getAuditHistory(patientId);

    res.status(200).json({
        success: true,
        message: 'Odontogram audit history retrieved successfully',
        data: history
    });
});
