import * as odontogramRepo from '../repository/odontogram.repository.js';
import AppError from '../utils/AppError.js';
import {
    PERMANENT_TEETH,
    DECIDUOUS_TEETH
} from '../constants/toothConstants.js';

/**
 * Helper to build default sound teeth array based on dentition type
 */
const buildDefaultTeeth = (dentitionType = 'permanent') => {
    let toothNumbers = [];
    if (dentitionType === 'permanent') {
        toothNumbers = PERMANENT_TEETH;
    } else if (dentitionType === 'deciduous') {
        toothNumbers = DECIDUOUS_TEETH;
    } else if (dentitionType === 'mixed') {
        toothNumbers = [...new Set([...PERMANENT_TEETH, ...DECIDUOUS_TEETH])];
    } else {
        toothNumbers = PERMANENT_TEETH;
    }

    return toothNumbers.map(num => ({
        toothNumber: num,
        condition: 'sound',
        surfaces: [],
        mobility: 0,
        isMissing: false,
        hasRootCanal: false,
        hasCrown: false,
        hasImplant: false,
        pocketDepth: { mesial: 0, distal: 0, buccal: 0, lingual: 0 },
        procedures: [],
        notes: '',
        updatedAt: new Date()
    }));
};

/**
 * Get all odontograms with pagination, filtering, and projection (for Admin Dashboard)
 */
export const getAllOdontograms = async (query = {}) => {
    const {
        page = 1,
        limit = 10,
        offset,
        status,
        doctorId,
        dentitionType,
        patientId,
        includeTeeth = 'false'
    } = query;

    const filter = {};
    if (status) filter.status = status;
    if (doctorId) filter.doctorId = doctorId;
    if (dentitionType) filter.dentitionType = dentitionType;
    if (patientId) filter.patientId = patientId;

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
    const skip = offset !== undefined
        ? Math.max(0, parseInt(offset, 10) || 0)
        : (parsedPage - 1) * parsedLimit;

    // Exclude heavy 32-tooth array & audit history by default for dashboard overview
    const select = includeTeeth === 'true' ? null : '-teeth -history';

    const { odontograms, total } = await odontogramRepo.findAll({
        filter,
        skip,
        limit: parsedLimit,
        sort: { createdAt: -1 },
        select
    });

    return {
        odontograms,
        total,
        page: parsedPage,
        limit: parsedLimit,
        offset: skip,
        totalPages: Math.ceil(total / parsedLimit),
        hasNextPage: skip + parsedLimit < total,
        hasPrevPage: skip > 0 || parsedPage > 1
    };
};

/**
 * Get existing odontogram or initialize a default healthy chart for patient
 */
export const getOrCreatePatientOdontogram = async (patientId, options = {}) => {
    const { dentitionType = 'permanent', doctorId, userId } = options;

    let odontogram = await odontogramRepo.findByPatientId(patientId);
    if (!odontogram) {
        const defaultTeeth = buildDefaultTeeth(dentitionType);
        const initialData = {
            patientId,
            doctorId: doctorId || null,
            dentitionType,
            teeth: defaultTeeth,
            generalNotes: 'Initial dental chart created',
            status: 'active',
            history: [{
                action: 'INITIAL_CREATION',
                details: { dentitionType, toothCount: defaultTeeth.length },
                updatedBy: userId || 'system',
                timestamp: new Date()
            }],
            createdBy: userId || null,
            lastUpdatedBy: userId || null
        };
        odontogram = await odontogramRepo.createOdontogram(initialData);
    }

    return odontogram;
};

/**
 * Create a new odontogram explicitly
 */
export const createOdontogram = async (data, userId) => {
    const { patientId, dentitionType = 'permanent' } = data;
    const existing = await odontogramRepo.findByPatientId(patientId);
    if (existing) {
        throw new AppError(`Active odontogram already exists for patient ${patientId}`, 409);
    }

    const teeth = (data.teeth && data.teeth.length > 0) ? data.teeth : buildDefaultTeeth(dentitionType);
    const newRecord = {
        ...data,
        teeth,
        createdBy: userId,
        lastUpdatedBy: userId,
        history: [{
            action: 'INITIAL_CREATION',
            details: { dentitionType, toothCount: teeth.length },
            updatedBy: userId,
            timestamp: new Date()
        }]
    };

    return await odontogramRepo.createOdontogram(newRecord);
};

/**
 * Update full patient odontogram
 */
export const updatePatientOdontogram = async (patientId, updateData, userId) => {
    const existing = await odontogramRepo.findByPatientId(patientId);
    if (!existing) {
        throw new AppError(`Odontogram not found for patient ${patientId}`, 404);
    }

    const historyEntry = {
        action: 'FULL_CHART_UPDATE',
        details: { fieldsUpdated: Object.keys(updateData) },
        updatedBy: userId,
        timestamp: new Date()
    };

    const payload = {
        ...updateData,
        lastUpdatedBy: userId,
        $push: { history: historyEntry }
    };

    const updated = await odontogramRepo.updateOdontogram(patientId, payload);
    return updated;
};

/**
 * Update a specific tooth's condition, surfaces, or details
 */
export const updateTooth = async (patientId, toothNumber, toothUpdates, userId) => {
    const existing = await odontogramRepo.findByPatientId(patientId);
    if (!existing) {
        throw new AppError(`Odontogram not found for patient ${patientId}`, 404);
    }

    const finalUpdates = { ...toothUpdates };
    if (finalUpdates.condition === 'missing' || finalUpdates.condition === 'extracted') {
        finalUpdates.isMissing = true;
    }
    if (finalUpdates.condition === 'root_canal') {
        finalUpdates.hasRootCanal = true;
    }
    if (finalUpdates.condition === 'crown') {
        finalUpdates.hasCrown = true;
    }
    if (finalUpdates.condition === 'implant') {
        finalUpdates.hasImplant = true;
        finalUpdates.isMissing = false;
    }

    const historyEntry = {
        action: 'TOOTH_UPDATE',
        toothNumber: Number(toothNumber),
        details: finalUpdates,
        updatedBy: userId,
        timestamp: new Date()
    };

    const result = await odontogramRepo.updateToothByNumber(patientId, toothNumber, finalUpdates, historyEntry);
    if (!result) {
        throw new AppError('Failed to update tooth state', 400);
    }
    return result;
};

/**
 * Add a procedure or treatment to a tooth
 */
export const addProcedure = async (patientId, toothNumber, procedureData, userId) => {
    const existing = await odontogramRepo.findByPatientId(patientId);
    if (!existing) {
        throw new AppError(`Odontogram not found for patient ${patientId}`, 404);
    }

    const historyEntry = {
        action: 'PROCEDURE_RECORDED',
        toothNumber: Number(toothNumber),
        details: procedureData,
        updatedBy: userId,
        timestamp: new Date()
    };

    const result = await odontogramRepo.addProcedureToTooth(patientId, toothNumber, procedureData, historyEntry);
    if (!result) {
        throw new AppError('Failed to add procedure', 400);
    }
    return result;
};

/**
 * Reset a tooth back to sound condition
 */
export const resetTooth = async (patientId, toothNumber, userId) => {
    const existing = await odontogramRepo.findByPatientId(patientId);
    if (!existing) {
        throw new AppError(`Odontogram not found for patient ${patientId}`, 404);
    }

    const historyEntry = {
        action: 'TOOTH_RESET',
        toothNumber: Number(toothNumber),
        details: { resetTo: 'sound' },
        updatedBy: userId,
        timestamp: new Date()
    };

    const result = await odontogramRepo.resetToothState(patientId, toothNumber, historyEntry);
    if (!result) {
        throw new AppError('Failed to reset tooth', 400);
    }
    return result;
};

/**
 * Compute dental summary statistics (DMFT Index & Health overview)
 */
export const getSummaryStatistics = async (patientId) => {
    const odontogram = await odontogramRepo.findByPatientId(patientId);
    if (!odontogram) {
        throw new AppError(`Odontogram not found for patient ${patientId}`, 404);
    }

    let decayedCount = 0;
    let missingCount = 0;
    let filledCount = 0;
    let soundCount = 0;
    let rootCanalCount = 0;
    let crownCount = 0;
    let implantCount = 0;

    odontogram.teeth.forEach(tooth => {
        const hasDecay = tooth.condition === 'caries' || tooth.surfaces.some(s => s.condition === 'caries');
        const isMissing = tooth.isMissing || tooth.condition === 'missing' || tooth.condition === 'extracted';
        const hasFilling = tooth.condition === 'filled' || tooth.surfaces.some(s => s.condition === 'filled' || s.material);

        if (hasDecay) decayedCount++;
        if (isMissing) missingCount++;
        if (hasFilling) filledCount++;
        if (tooth.condition === 'sound' && !hasDecay && !isMissing && !hasFilling) soundCount++;

        if (tooth.hasRootCanal || tooth.condition === 'root_canal') rootCanalCount++;
        if (tooth.hasCrown || tooth.condition === 'crown') crownCount++;
        if (tooth.hasImplant || tooth.condition === 'implant') implantCount++;
    });

    const dmftIndex = decayedCount + missingCount + filledCount;

    return {
        patientId,
        dentitionType: odontogram.dentitionType,
        totalTeethTracked: odontogram.teeth.length,
        dmft: {
            decayed: decayedCount,
            missing: missingCount,
            filled: filledCount,
            totalDMFT: dmftIndex
        },
        counts: {
            sound: soundCount,
            rootCanals: rootCanalCount,
            crowns: crownCount,
            implants: implantCount
        },
        lastUpdated: odontogram.updatedAt
    };
};

/**
 * Get audit history
 */
export const getAuditHistory = async (patientId) => {
    return await odontogramRepo.getAuditHistory(patientId);
};
