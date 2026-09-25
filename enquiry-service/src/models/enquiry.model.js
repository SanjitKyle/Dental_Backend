import mongoose from 'mongoose';


const EnquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Patient name is required'],
        trim: true
    },
    gender:{
        type:String
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        index: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    address:{
        type:String
    },
    serviceRequested: {
        type: String,
        trim: true,
        default: 'General Consultation'
    },
    preferredDoctorId: {
        type: String,
        default: null
    },
    preferredDoctorName: {
        type: String,
        default: null
    },
    preferredDate: {
        type: String,
        default: null
    },
    preferredTime: {
        type: String,
        default: null
    },
    message: {
        type: String,
        trim: true,
        default: ''
    },
    source: {
        type: String,
        enum: ['Website', 'Phone Call', 'Walk-in', 'Social Media', 'Google Ad', 'Referral', 'Other'],
        default: 'Website'
    },
    status: {
        type: String,
        enum: [
            'New',                    // 1. Fresh lead, not contacted yet
            'Contacted',              // 2. Staff has called/messaged the lead
            'Follow-up Needed',       // 3. Patient requested a callback later
            'Appointment Booked',     // 4. (Replaces 'Appointmented') An appointment slot has been scheduled
            'Converted',              // 5. Patient arrived, registered, and received treatment
            'Lost',                   // 6. Lead declined, price too high, or unreachable
            'Closed'                  // 7. Completed or invalid/spam inquiry
        ], 
        default: 'New',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    assignedTo: {
        userId: { type: String, default: null },
        name: { type: String, default: null }
    },
    convertedPatientId: {
        type: String,
        default: null
    },
    convertedAppointmentId: {
        type: String,
        default: null
    },
    cancellationReason: {
        type: String,
        default: null
    },
    createdBy: {
        type: String,
        default: 'system'
    },
    lastUpdatedBy: {
        type: String,
        default: 'system'
    },
    internal_notes:{
        type:String
    }
}, {
    timestamps: true
});

export default mongoose.model('Enquiry', EnquirySchema);
