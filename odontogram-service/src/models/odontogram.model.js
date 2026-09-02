import mongoose from 'mongoose';
import {
    TOOTH_CONDITIONS,
    TOOTH_SURFACES,
    RESTORATION_MATERIALS,
    TREATMENT_STATUSES,
    DENTITION_TYPES
} from '../constants/toothConstants.js';

const SurfaceSchema = new mongoose.Schema({
    surface: {
        type: String,
        enum: TOOTH_SURFACES,
        required: true
    },
    condition: {
        type: String,
        enum: TOOTH_CONDITIONS,
        default: 'sound'
    },
    material: {
        type: String,
        enum: [...RESTORATION_MATERIALS, null],
        default: null
    },
    status: {
        type: String,
        enum: TREATMENT_STATUSES,
        default: 'existing'
    }
}, { _id: false });

const ProcedureSchema = new mongoose.Schema({
    procedureName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: TREATMENT_STATUSES,
        default: 'diagnosed'
    },
    material: {
        type: String,
        enum: [...RESTORATION_MATERIALS, null],
        default: null
    },
    surfaces: [{
        type: String,
        enum: TOOTH_SURFACES
    }],
    notes: {
        type: String
    },
    cost: {
        type: Number
    },
    performedBy: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const ToothSchema = new mongoose.Schema({
    toothNumber: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        enum: TOOTH_CONDITIONS,
        default: 'sound'
    },
    surfaces: [SurfaceSchema],
    mobility: {
        type: Number,
        min: 0,
        max: 3,
        default: 0
    },
    isMissing: {
        type: Boolean,
        default: false
    },
    hasRootCanal: {
        type: Boolean,
        default: false
    },
    hasCrown: {
        type: Boolean,
        default: false
    },
    hasImplant: {
        type: Boolean,
        default: false
    },
    pocketDepth: {
        mesial: { type: Number, default: 0 },
        distal: { type: Number, default: 0 },
        buccal: { type: Number, default: 0 },
        lingual: { type: Number, default: 0 }
    },
    procedures: [ProcedureSchema],
    notes: {
        type: String,
        default: ''
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const HistoryEntrySchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    toothNumber: {
        type: Number
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
    updatedBy: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const OdontogramSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true,
        index: true
    },
    doctorId: {
        type: String
    },
    dentitionType: {
        type: String,
        enum: DENTITION_TYPES,
        default: 'permanent'
    },
    teeth: [ToothSchema],
    generalNotes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    },
    history: [HistoryEntrySchema],
    createdBy: {
        type: String
    },
    lastUpdatedBy: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('Odontogram', OdontogramSchema);
