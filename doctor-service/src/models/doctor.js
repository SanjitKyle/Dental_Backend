import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    // Links to the Auth Service so doctors can log in
    userId: {
        type: String,
    },
    full_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },

    // Professional Details
    specialization: {
        type: String,
        required: true,
        enum: ['General Dentist', 'Orthodontist', 'Endodontist', 'Pediatric Dentist', 'Oral Surgeon', 'Prosthodontist']
    },
    qualifications: {
        type: [String], // Array of degrees e.g., ["BDS", "MDS"]
        required: true
    },
    experience_years: {
        type: Number,
        required: true
    },
    consultation_fee: {
        type: Number,
        required: true
    },
    bio: {
        type: String,
    },

    // Scheduling & Availability
    working_days: {
        type: [String],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    shift_start_time: {
        type: String,
        default: "09:00 AM"
    },
    shift_end_time: {
        type: String,
        default: "05:00 PM"
    },

    // Status
    status: {
        type: String,
        enum: ['Active', 'On Leave', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });

export default mongoose.model('Doctor', doctorSchema);