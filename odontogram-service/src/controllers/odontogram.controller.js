import * as odontogramService from '../services/odontogram.service.js';

export const getPatientOdontogram = async (req, res) => {
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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch odontogram'
        });
    }
};

export const createOdontogram = async (req, res) => {
    try {
        const userId = req.userId;
        const newOdontogram = await odontogramService.createOdontogram(req.body, userId);

        res.status(201).json({
            success: true,
            message: 'Odontogram created successfully',
            data: newOdontogram
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create odontogram'
        });
    }
};

export const updatePatientOdontogram = async (req, res) => {
    try {
        const { patientId } = req.params;
        const userId = req.userId;

        const updated = await odontogramService.updatePatientOdontogram(patientId, req.body, userId);
        res.status(200).json({
            success: true,
            message: 'Odontogram updated successfully',
            data: updated
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update odontogram'
        });
    }
};

export const updateTooth = async (req, res) => {
    try {
        const { patientId, toothNumber } = req.params;
        const userId = req.userId;

        const updated = await odontogramService.updateTooth(patientId, toothNumber, req.body, userId);
        res.status(200).json({
            success: true,
            message: `Tooth ${toothNumber} updated successfully`,
            data: updated
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update tooth'
        });
    }
};

export const addProcedure = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to add procedure'
        });
    }
};

export const resetTooth = async (req, res) => {
    try {
        const { patientId, toothNumber } = req.params;
        const userId = req.userId;

        const updated = await odontogramService.resetTooth(patientId, toothNumber, userId);
        res.status(200).json({
            success: true,
            message: `Tooth ${toothNumber} reset to sound condition`,
            data: updated
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to reset tooth'
        });
    }
};

export const getSummary = async (req, res) => {
    try {
        const { patientId } = req.params;
        const summary = await odontogramService.getSummaryStatistics(patientId);

        res.status(200).json({
            success: true,
            message: 'Odontogram summary retrieved successfully',
            data: summary
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to retrieve summary'
        });
    }
};

export const getHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const history = await odontogramService.getAuditHistory(patientId);

        res.status(200).json({
            success: true,
            message: 'Odontogram audit history retrieved successfully',
            data: history
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch history'
        });
    }
};
