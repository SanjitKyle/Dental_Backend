// models entry point for patient-service
import mongoose from "mongoose";
const Patient = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    full_name: {
        type: String,
        required: true         
    },
    date_of_birth: {
        type: Date,
    },
    age: {
        type: String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Male'
    },
    blood_group: {
        type: String,

    },
    phone: {
        type: Number
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    note: {
        type: String

    },
    height: {
        type: String
    },
    weight: {
        type: String
    },
    emergency_contact_name: {
        type: String
    },
    emergency_contact_phone: {
        type: Number
    },
    relation: {
        type: String
    },
    last_visit: {
        type: String
    },
    assigned_doctor_id: {
        type: String
    },
    assigned_doctor_name: {
        type: String
    },
    created_by: {
        type: String
    }
}, { timestamps: true })

export default mongoose.model('Patient', Patient);