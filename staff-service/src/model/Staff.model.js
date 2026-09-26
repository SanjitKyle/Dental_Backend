import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    // 1. Identity
    employeeuserId: { type: String, unique: true, sparse: true }, // e.g., DEN-STF-001
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: { type: String, required: true },
    emergencyContact: {
        name: String,
        relation: String,
        phone: String
    },

    // 2. Employment
    employment: { 
        type: String, 
        enum: ['NURSE', 'RECEPTIONIST', 'ADMIN', 'TECHNICIAN', 'BILLING'], 
        required: true 
    },
    designation: { type: String }, // e.g., "Senior X-Ray Tech"
    department: { type: String, required: true },
    employmentType: { 
        type: String, 
        enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT'], 
        default: 'FULL_TIME' 
    },
    
    // 3. Security & Access Control
   permissions: [{
        type: String,
        enum: [
            // Patients
            'VIEW_PATIENT', 'CREATE_PATIENT', 'EDIT_PATIENT', 'DELETE_PATIENT',
            
            // Appointments
            'VIEW_APPOINTMENT', 'CREATE_APPOINTMENT', 'EDIT_APPOINTMENT', 'CANCEL_APPOINTMENT',
            
            // Admin & Billing
            'PROCESS_BILLING', 'VIEW_REPORTS', 'MANAGE_INVENTORY', 'MANAGE_STAFF',
            
            // Enquiries
            'VIEW_ENQUIRY', 'MANAGE_ENQUIRY', 'EDIT_ENQUIRY', 'DELETE_ENQUIRY',
            
            // Follow-ups
            'MANAGE_FOLLOW_UP', 'EDIT_FOLLOW_UP', 'DELETE_FOLLOW_UP',
            
            // Odontogram (Dental Charting)
            'VIEW_ODONTOGRAM', 'CREATE_ODONTOGRAM', 'EDIT_ODONTOGRAM', 'DELETE_ODONTOGRAM'
        ]
    }],

        
    // 4. Lifecycle & Status
    dateOfJoining: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED'], 
        default: 'ACTIVE',
        index:true
    },
    
    // 6. Audit
    createdBy: { type:String, index:true}
    
}, { timestamps: true });

staffSchema.index({ createdAt: -1 });
staffSchema.index({ department: 1, status: 1 });
const Staff = mongoose.model('Staff', staffSchema);

export default Staff;