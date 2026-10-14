import mongoose from 'mongoose';

const ClinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Clinic name is required'],
      trim: true,
      index: true,
    },
    ownerName: {
      type: String,
      required: [true, 'Owner / Principal Doctor name is required'],
      trim: true,
    },
    ownerEmail: {
      type: String,
      required: [true, 'Owner email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    ownerUserId: {
      type: String, // Reference to Auth Service user _id
      default: null,
    },
    phone: {
      type: String,
      required: [true, 'Clinic phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    logo: {
      type: String, // URL / base64 for invoice and prescription letterheads
      default: '',
    },
    gstin: {
      type: String, // Tax identification number for A4 billing
      default: '',
      trim: true,
    },
    website: {
      type: String,
      default: '',
    },
    tagline: {
      type: String,
      default: 'Specialized Dental & Maxillofacial Care',
    },

    // 💳 Multi-Tenant SaaS Subscription & Entitlements
    subscription: {
      plan: {
        type: String,
        enum: ['TRIAL', 'STARTER', 'PRO', 'ENTERPRISE'],
        default: 'TRIAL',
      },
      status: {
        type: String,
        enum: ['ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED'],
        default: 'ACTIVE',
      },
      trialEndsAt: {
        type: Date,
        default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day free trial
      },
      currentPeriodEnd: {
        type: Date,
        default: null,
      },
      maxDoctors: {
        type: Number,
        default: 5, // Plan-specific limit
      },
      maxStaff: {
        type: Number,
        default: 10,
      },
    },

    // Control flag for Super Admin (freeze/unfreeze clinic)
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for super-admin analytics and active search
ClinicSchema.index({ 'subscription.status': 1, isActive: 1 });

export default mongoose.models.Clinic || mongoose.model('Clinic', ClinicSchema);
