import express from 'express';
import {
    createPrescription,
    getPrescriptionById,
    getPrescriptionByNumber,
    getPrescriptionsByPatient,
    getPrescriptionsByDoctor,
    getPrescriptionsByAppointment,
    updatePrescription,
    updateStatus,
    deletePrescription
} from '../controllers/prescription.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MedicationItem:
 *       type: object
 *       required:
 *         - medicineName
 *         - dosage
 *         - frequency
 *         - duration
 *       properties:
 *         medicineName:
 *           type: string
 *           example: "Amoxicillin"
 *         genericName:
 *           type: string
 *           example: "Amoxicillin Trihydrate"
 *         dosageForm:
 *           type: string
 *           enum: [Tablet, Capsule, Syrup, Mouthwash, Gel, Ointment, Injection, Drops, Other]
 *           example: "Capsule"
 *         strength:
 *           type: string
 *           example: "500mg"
 *         dosage:
 *           type: string
 *           example: "1 capsule"
 *         frequency:
 *           type: string
 *           enum: [OD, BD, TDS, QID, SOS, STAT, HS, Custom]
 *           example: "TDS"
 *         frequencyDetails:
 *           type: string
 *           example: "1-1-1 (Morning, Afternoon, Night)"
 *         timing:
 *           type: string
 *           enum: [Before Food, After Food, With Food, Empty Stomach, As Directed]
 *           example: "After Food"
 *         duration:
 *           type: object
 *           properties:
 *             value:
 *               type: number
 *               example: 5
 *             unit:
 *               type: string
 *               enum: [Days, Weeks, Months]
 *               example: "Days"
 *         quantity:
 *           type: number
 *           example: 15
 *         route:
 *           type: string
 *           enum: [Oral, Topical, Sublingual, Intravenous, Intramuscular, Rinse/Gargle]
 *           example: "Oral"
 *         instructions:
 *           type: string
 *           example: "Complete the full antibiotic course"
 *         isGenericSubstitutable:
 *           type: boolean
 *           example: true
 *     PrescriptionInput:
 *       type: object
 *       required:
 *         - patientId
 *         - doctorId
 *         - medications
 *       properties:
 *         patientId:
 *           type: string
 *           example: "64f8a12bc9e77b102c890123"
 *         doctorId:
 *           type: string
 *           example: "64f8a12bc9e77b102c890456"
 *         appointmentId:
 *           type: string
 *           example: "64f8a12bc9e77b102c890789"
 *         chiefComplaint:
 *           type: string
 *           example: "Severe toothache in lower right molar"
 *         diagnosis:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Acute Periapical Abscess (#46)"]
 *         patientAllergiesSnapshot:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Penicillin"]
 *         vitalsSnapshot:
 *           type: object
 *           properties:
 *             bloodPressure:
 *               type: string
 *               example: "120/80 mmHg"
 *             pulseRate:
 *               type: string
 *               example: "72 bpm"
 *             weight:
 *               type: string
 *               example: "70 kg"
 *         medications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MedicationItem'
 *         diagnosticTestsAdvised:
 *           type: array
 *           items:
 *             type: string
 *           example: ["IOPA X-Ray (#46)"]
 *         generalAdvice:
 *           type: string
 *           example: "Avoid chewing hard food on right side. Warm saline rinses after 24 hours."
 *         followUpDate:
 *           type: string
 *           format: date
 *           example: "2026-09-11"
 *         followUpInstructions:
 *           type: string
 *           example: "Return for Root Canal second sitting"
 */

/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: Prescription and Medication management API
 */

/**
 * @swagger
 * /api/prescriptions:
 *   post:
 *     summary: Create a new prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrescriptionInput'
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, createPrescription);

/**
 * @swagger
 * /api/prescriptions/patient/{patientId}:
 *   get:
 *     summary: Get all prescriptions for a patient
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, active, dispensed, cancelled, expired]
 *     responses:
 *       200:
 *         description: List of patient prescriptions
 */
router.get('/patient/:patientId', authMiddleware, getPrescriptionsByPatient);

/**
 * @swagger
 * /api/prescriptions/doctor/{doctorId}:
 *   get:
 *     summary: Get all prescriptions written by a doctor
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of doctor prescriptions
 */
router.get('/doctor/:doctorId', authMiddleware, getPrescriptionsByDoctor);

/**
 * @swagger
 * /api/prescriptions/appointment/{appointmentId}:
 *   get:
 *     summary: Get prescriptions associated with an appointment
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of prescriptions for appointment
 */
router.get('/appointment/:appointmentId', authMiddleware, getPrescriptionsByAppointment);

/**
 * @swagger
 * /api/prescriptions/number/{prescriptionNumber}:
 *   get:
 *     summary: Lookup prescription by prescription number (e.g. RX-20260904-0001)
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prescriptionNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prescription found
 *       404:
 *         description: Prescription not found
 */
router.get('/number/:prescriptionNumber', authMiddleware, getPrescriptionByNumber);

/**
 * @swagger
 * /api/prescriptions/{id}:
 *   get:
 *     summary: Get prescription details by ID
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prescription found
 *       404:
 *         description: Prescription not found
 */
router.get('/:id', authMiddleware, getPrescriptionById);

/**
 * @swagger
 * /api/prescriptions/{id}:
 *   put:
 *     summary: Update an active prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Prescription updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/:id', authMiddleware, updatePrescription);

/**
 * @swagger
 * /api/prescriptions/{id}/status:
 *   patch:
 *     summary: Update prescription status (dispensed, cancelled, expired, etc.)
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, active, dispensed, cancelled, expired]
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Bad request
 */
router.patch('/:id/status', authMiddleware, updateStatus);

/**
 * @swagger
 * /api/prescriptions/{id}:
 *   delete:
 *     summary: Delete a prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prescription deleted successfully
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authMiddleware, deletePrescription);

export default router;
