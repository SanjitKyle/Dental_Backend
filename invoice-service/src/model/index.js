import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },          // Service name
  qty:          { type: Number, required: true, default: 1 },
  rate:         { type: Number, required: true },          // Price per unit
  discount:     { type: Number, default: 0 },              // % discount on this item
  amount:       { type: Number },                          // Computed: qty * rate * (1 - discount/100)
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  // ── Auto-generated ──────────────────────────
  invoiceNumber: { type: String, unique: true },           // e.g. INV-2024-001

  // ── Patient Info ────────────────────────────
  patientId:    { type:String},

  // ── Clinic / Doctor Info ─────────────────────
  doctorId:     { type:String },

  // ── Appointment Link (optional) ──────────────
  appointmentId: { type:String },

  // ── Dates ────────────────────────────────────
  invoiceDate:  { type: Date, required: true, default: Date.now },
  dueDate:      { type: Date },

  // ── Line Items ────────────────────────────────
  items:        { type: [lineItemSchema], required: true },

  // ── Financials ────────────────────────────────
  subtotal:     { type: Number, required: true },          // Sum of all line items after item-level discounts
  taxPercent:   { type: Number, default: 0 },              // e.g. 18 for 18% GST
  taxAmount:    { type: Number, default: 0 },
  totalAmount:  { type: Number, required: true },          // subtotal + taxAmount

  // ── Payment ───────────────────────────────────
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Insurance'],
    default: 'Cash'
  },
  paymentDate:  { type: Date },                            // When payment was received

  // ── Status ────────────────────────────────────
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Pending'
  },

  // ── Notes ─────────────────────────────────────
  notes:        { type: String },

  // ── Audit ─────────────────────────────────────
  createdBy:    { type:String },

}, { timestamps: true });   // adds createdAt, updatedAt automatically

// Auto-generate invoice number before save
invoiceSchema.pre('save', async function () {
  if (!this.invoiceNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(3, '0')}`;
  }
});

export default mongoose.model('Invoice', invoiceSchema);