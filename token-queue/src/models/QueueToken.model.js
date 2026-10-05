import mongoose from 'mongoose';

const QueueTokenSchema = new mongoose.Schema(
  {
    // Token Sequence & Identification
    tokenNumber: {
      type: Number,
      required: true,
      index: true,
    },
    tokenCode: {
      type: String, // e.g. 'T-01', 'T-02', 'EM-01'
      required: true,
    },
    queueDate: {
      type: String, // 'YYYY-MM-DD'
      required: true,
      index: true,
      default: () => new Date().toISOString().split('T')[0],
    },

    // 🔗 Patient Reference (Foreign ID managed by patient-service)
    patientId: {
      type: String,
      required: [true, 'Patient ID reference is required'],
      index: true,
    },

    // Patient snapshot for high-speed offline / disconnected token display
    patientSnapshot: {
      name: { type: String, required: true },
      phone: { type: String, default: '' },
      age: { type: Number },
      gender: { type: String, default: 'Male' },
    },

    // Doctor & Clinical Details
    doctorId: {
      type: String,
      required: [true, 'Doctor ID is required'],
      index: true,
    },
    doctorName: {
      type: String,
      required: [true, 'Doctor name is required'],
    },
    service: {
      type: String,
      default: 'General Consultation',
    },
    roomNumber: {
      type: String,
      default: 'Chair 1',
    },

    // Priority & Clinical Urgency
    priority: {
      type: String,
      enum: ['EMERGENCY', 'URGENT', 'SENIOR', 'APPOINTMENT', 'NORMAL'],
      default: 'NORMAL',
      index: true,
    },
    priorityRank: {
      type: Number, // 1: EMERGENCY, 2: URGENT, 3: SENIOR, 4: APPOINTMENT, 5: NORMAL
      default: 5,
    },

    // Queue Lifecycle Status
    status: {
      type: String,
      enum: ['WAITING', 'IN_CONSULTATION', 'COMPLETED', 'SKIPPED', 'CANCELLED'],
      default: 'WAITING',
      index: true,
    },

    // Timestamps for Audit & Wait Time Analytics
    issuedTime: {
      type: Date,
      default: Date.now,
    },
    consultationStartTime: {
      type: Date,
      default: null,
    },
    consultationEndTime: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    issuedBy: {
      type: String, // User ID who generated token
    },
  },
  {
    timestamps: true,
  }
);

// 🚀 Compound Index for high-speed retrieval of doctor's daily active queue
QueueTokenSchema.index({ queueDate: 1, doctorId: 1, status: 1, priorityRank: 1 });

// Synchronous Mongoose 9-compatible pre-validate hook for priority ranking
QueueTokenSchema.pre('validate', function () {
  const rankMap = {
    EMERGENCY: 1,
    URGENT: 2,
    SENIOR: 3,
    APPOINTMENT: 4,
    NORMAL: 5,
  };
  this.priorityRank = rankMap[this.priority] || 5;
});

export default mongoose.models.QueueToken || mongoose.model('QueueToken', QueueTokenSchema);
