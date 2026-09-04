import mongoose from 'mongoose';

const MedicationItemSchema = new mongoose.Schema({
    medicineName: {
        type: String,
        required: [true, 'Medicine name is required'],
        trim: true
    },
    genericName: {
        type: String,
        trim: true
    },
    dosageForm: {
        type: String,
        enum: ['Tablet', 'Capsule', 'Syrup', 'Mouthwash', 'Gel', 'Ointment', 'Injection', 'Drops', 'Other'],
        default: 'Tablet'
    },
    strength: {
        type: String
    },
    dosage: {
        type: String,
        required: [true, 'Dosage is required']
    },
    frequency: {
        type: String,
        required: [true, 'Frequency is required'],
        enum: ['OD', 'BD', 'TDS', 'QID', 'SOS', 'STAT', 'HS', 'Custom'],
        default: 'BD'
    },
    frequencyDetails: {
        type: String
    },
    timing: {
        type: String,
        enum: ['Before Food', 'After Food', 'With Food', 'Empty Stomach', 'As Directed'],
        default: 'After Food'
    },
    duration: {
        value: { type: Number, required: true },
        unit: {
            type: String,
            enum: ['Days', 'Weeks', 'Months'],
            default: 'Days'
        }
    },
    quantity: {
        type: Number
    },
    route: {
        type: String,
        enum: ['Oral', 'Topical', 'Sublingual', 'Intravenous', 'Intramuscular', 'Rinse/Gargle'],
        default: 'Oral'
    },
    instructions: {
        type: String
    },
    isGenericSubstitutable: {
        type: Boolean,
        default: true
    }
}, { _id: true });

const PrescriptionSchema = new mongoose.Schema({
    prescriptionNumber: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    patientId: {
        type: String,
        required: [true, 'Patient ID is required'],
        index: true
    },
    doctorId: {
        type: String,
        required: [true, 'Doctor ID is required'],
        index: true
    },
    appointmentId: {
        type: String,
        default: null
    },
    chiefComplaint: {
        type: String
    },
    diagnosis: [{
        type: String
    }],
    patientAllergiesSnapshot: [{
        type: String
    }],
    vitalsSnapshot: {
        bloodPressure: { type: String },
        pulseRate: { type: String },
        weight: { type: String }
    },
    medications: {
        type: [MedicationItemSchema],
        validate: [arr => arr && arr.length > 0, 'Prescription must contain at least one medication']
    },
    diagnosticTestsAdvised: [{
        type: String
    }],
    generalAdvice: {
        type: String
    },
    followUpDate: {
        type: Date
    },
    followUpInstructions: {
        type: String
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'dispensed', 'cancelled', 'expired'],
        default: 'active'
    },
    digitalSignature: {
        doctorName: { type: String },
        licenseNumber: { type: String },
        signatureHash: { type: String },
        signedAt: { type: Date }
    },
    pdfUrl: {
        type: String
    },
    createdBy: {
        type: String,
        required: true
    },
    lastUpdatedBy: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model('Prescription', PrescriptionSchema);
