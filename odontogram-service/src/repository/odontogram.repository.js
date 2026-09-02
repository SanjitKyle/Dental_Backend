import Odontogram from '../models/odontogram.model.js';

export const findByPatientId = async (patientId, status = 'active') => {
    return await Odontogram.findOne({ patientId, status });
};

export const findById = async (id) => {
    return await Odontogram.findById(id);
};

export const createOdontogram = async (data) => {
    const odontogram = new Odontogram(data);
    return await odontogram.save();
};

export const updateOdontogram = async (patientId, updateData) => {
    return await Odontogram.findOneAndUpdate(
        { patientId, status: 'active' },
        { $set: updateData },
        { new: true, runValidators: true }
    );
};

export const updateToothByNumber = async (patientId, toothNumber, toothUpdates, historyEntry) => {
    const odontogram = await Odontogram.findOne({ patientId, status: 'active' });
    if (!odontogram) {
        return null;
    }

    const toothIndex = odontogram.teeth.findIndex(t => t.toothNumber === Number(toothNumber));
    if (toothIndex === -1) {
        // If tooth not found in array, push it
        odontogram.teeth.push({
            toothNumber: Number(toothNumber),
            ...toothUpdates,
            updatedAt: new Date()
        });
    } else {
        // Merge updates into existing tooth
        const currentTooth = odontogram.teeth[toothIndex].toObject();
        odontogram.teeth[toothIndex] = {
            ...currentTooth,
            ...toothUpdates,
            toothNumber: Number(toothNumber),
            updatedAt: new Date()
        };
    }

    if (historyEntry) {
        odontogram.history.push(historyEntry);
    }

    odontogram.lastUpdatedBy = historyEntry?.updatedBy || odontogram.lastUpdatedBy;
    return await odontogram.save();
};

export const addProcedureToTooth = async (patientId, toothNumber, procedureData, historyEntry) => {
    const odontogram = await Odontogram.findOne({ patientId, status: 'active' });
    if (!odontogram) {
        return null;
    }

    let tooth = odontogram.teeth.find(t => t.toothNumber === Number(toothNumber));
    if (!tooth) {
        odontogram.teeth.push({
            toothNumber: Number(toothNumber),
            condition: 'sound',
            procedures: [procedureData],
            updatedAt: new Date()
        });
    } else {
        tooth.procedures.push(procedureData);
        tooth.updatedAt = new Date();
    }

    if (historyEntry) {
        odontogram.history.push(historyEntry);
    }

    odontogram.lastUpdatedBy = historyEntry?.updatedBy || odontogram.lastUpdatedBy;
    return await odontogram.save();
};

export const resetToothState = async (patientId, toothNumber, historyEntry) => {
    const odontogram = await Odontogram.findOne({ patientId, status: 'active' });
    if (!odontogram) {
        return null;
    }

    const toothIndex = odontogram.teeth.findIndex(t => t.toothNumber === Number(toothNumber));
    if (toothIndex !== -1) {
        odontogram.teeth[toothIndex] = {
            toothNumber: Number(toothNumber),
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
        };
    }

    if (historyEntry) {
        odontogram.history.push(historyEntry);
    }

    return await odontogram.save();
};

export const getAuditHistory = async (patientId) => {
    const odontogram = await Odontogram.findOne({ patientId, status: 'active' }, { history: 1, patientId: 1, updatedAt: 1 });
    return odontogram ? odontogram.history : [];
};

export const deleteOrArchive = async (patientId, archiveOnly = true) => {
    if (archiveOnly) {
        return await Odontogram.findOneAndUpdate(
            { patientId, status: 'active' },
            { $set: { status: 'archived' } },
            { new: true }
        );
    }
    return await Odontogram.findOneAndDelete({ patientId });
};
