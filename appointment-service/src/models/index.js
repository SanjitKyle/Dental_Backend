import mongoose from "mongoose";

// models entry point for appointment-service
const appointment = mongoose.Schema({
    patient: {
        type: String,
        required: true
    },
    doctor: {
        type: String,
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    start_time: {
        type: String
    },
    end_time: {
        type: String
    },
    date: {
        type: String
    },
    service: {
        type: String
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'No-Show', 'Rescheduled','Follow-up']
    },
    visit_type: {
        type: String,
        enum: ["Consultation", "Follow-up", "Routine Checkup", "Emergency", "Telehealth/Online"]
    },
    reasonForVisit: {
        type: String
    },

  
}, { timestamps: true });

// 1. Compound index for lightning-fast user paginated queries (sorted newest first)
appointment.index({ created_by: 1, createdAt: -1 });

// 2. Index for doctor daily schedule lookups
appointment.index({ doctor: 1, date: 1 });

// 3. Index for patient appointment history
appointment.index({ patient: 1, date: 1 });

// 4. Double-Booking Prevention: Unique compound index across (doctor + date + start_time)
// Uses partialFilterExpression so cancelled appointments release the slot for new bookings!
appointment.index(
    { doctor: 1, date: 1, start_time: 1 },
    { 
        unique: true,
        partialFilterExpression: { status: { $ne: 'Cancelled' } }
    }
);

export const appointMent = mongoose.model("appointMent", appointment);