import express from 'express';
import { 
    createPatientProfile, 
    getPatientProfile, 
    updatePatientProfile, 
    getAllPatients 
} from '../controllers/patient.controller.js';
import authMiddleware from '../middleware/auth.js'; // Assuming auth middleware exists

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       required:
 *         - date_of_birth
 *       properties:
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: Date of birth
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *           default: Male
 *         blood_group:
 *           type: string
 *         address:
 *           type: string
 *         height:
 *           type: string
 *         weight:
 *           type: string
 *         medical_history_note:
 *           type: string
 *         allergies:
 *           type: string
 *         emergency_contact_name:
 *           type: string
 *         emergency_contact_number:
 *           type: string
 *         relation:
 *           type: string
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management API
 */

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Create a new patient profile
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Patient profile created successfully
 *       400:
 *         description: Bad request or profile already exists
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, createPatientProfile);

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: A list of patients
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllPatients); // Could add admin auth middleware here if needed

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get a specific patient profile by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The patient ID
 *     responses:
 *       200:
 *         description: Patient profile found
 *       404:
 *         description: Profile not found
 */
router.get('/:id', getPatientProfile);

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Update a specific patient profile
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       200:
 *         description: Patient profile updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.put('/:id', authMiddleware, updatePatientProfile);

export default router;
