import express from 'express';
import {
    getPatientOdontogram,
    createOdontogram,
    updatePatientOdontogram,
    updateTooth,
    addProcedure,
    resetTooth,
    getSummary,
    getHistory
} from '../controllers/odontogram.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Surface:
 *       type: object
 *       required:
 *         - surface
 *       properties:
 *         surface:
 *           type: string
 *           enum: [mesial, distal, occlusal, incisal, buccal, lingual, palatal, cervical, root]
 *           example: occlusal
 *         condition:
 *           type: string
 *           enum: [sound, caries, filled, missing, impacted, crown, bridge_abutment, bridge_pontic, implant, root_canal, extracted, veneer, fracture, denture, orthodontic_bracket, retained_root, sealant, other]
 *           example: caries
 *         material:
 *           type: string
 *           enum: [composite, amalgam, glass_ionomer, ceramic, porcelain_fused_to_metal, gold, zirconia, acrylic, temporary, other]
 *           example: composite
 *         status:
 *           type: string
 *           enum: [existing, diagnosed, in_progress, completed]
 *           example: diagnosed
 *     Tooth:
 *       type: object
 *       required:
 *         - toothNumber
 *       properties:
 *         toothNumber:
 *           type: integer
 *           description: FDI tooth number (e.g., 18, 11, 21, 36, 48)
 *           example: 16
 *         condition:
 *           type: string
 *           enum: [sound, caries, filled, missing, impacted, crown, bridge_abutment, bridge_pontic, implant, root_canal, extracted, veneer, fracture, denture, orthodontic_bracket, retained_root, sealant, other]
 *           example: caries
 *         surfaces:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Surface'
 *         mobility:
 *           type: integer
 *           minimum: 0
 *           maximum: 3
 *           example: 0
 *         isMissing:
 *           type: boolean
 *           example: false
 *         hasRootCanal:
 *           type: boolean
 *           example: false
 *         hasCrown:
 *           type: boolean
 *           example: false
 *         hasImplant:
 *           type: boolean
 *           example: false
 *         notes:
 *           type: string
 *           example: "Deep occlusal cavity"
 *     ProcedureInput:
 *       type: object
 *       required:
 *         - procedureName
 *       properties:
 *         toothNumber:
 *           type: integer
 *           example: 16
 *         procedureName:
 *           type: string
 *           example: "Composite Restoration"
 *         status:
 *           type: string
 *           enum: [existing, diagnosed, in_progress, completed]
 *           example: completed
 *         material:
 *           type: string
 *           example: composite
 *         surfaces:
 *           type: array
 *           items:
 *             type: string
 *           example: ["occlusal", "mesial"]
 *         notes:
 *           type: string
 *           example: "Class II composite restoration"
 *         cost:
 *           type: number
 *           example: 150
 *         performedBy:
 *           type: string
 *           example: "Dr. Smith"
 *     OdontogramInput:
 *       type: object
 *       required:
 *         - patientId
 *       properties:
 *         patientId:
 *           type: string
 *           example: "64f8a12bc9e77b102c890123"
 *         doctorId:
 *           type: string
 *           example: "64f8a12bc9e77b102c890456"
 *         dentitionType:
 *           type: string
 *           enum: [permanent, deciduous, mixed]
 *           default: permanent
 *         generalNotes:
 *           type: string
 *           example: "Good overall oral hygiene"
 *         teeth:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tooth'
 */

/**
 * @swagger
 * tags:
 *   name: Odontograms
 *   description: Dental charting and odontogram management API
 */

/**
 * @swagger
 * /api/odontograms/patient/{patientId}:
 *   get:
 *     summary: Get or automatically initialize an active odontogram for a patient
 *     tags: [Odontograms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *       - in: query
 *         name: dentitionType
 *         schema:
 *           type: string
 *           enum: [permanent, deciduous, mixed]
 *         description: Type of dentition to initialize if none exists
 *     responses:
 *       200:
 *         description: Odontogram retrieved or initialized successfully
 *       400:
 *         description: Bad request
 */
router.get('/patient/:patientId', authMiddleware, getPatientOdontogram);

/**
 * @swagger
 * /api/odontograms:
 *   post:
 *     summary: Explicitly create a new odontogram
 *     tags: [Odontograms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OdontogramInput'
 *     responses:
 *       201:
 *         description: Odontogram created
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, createOdontogram);

/**
 * @swagger
 * /api/odontograms/patient/{patientId}:
 *   put:
 *     summary: Update complete odontogram for a patient
 *     tags: [Odontograms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
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
 *         description: Odontogram updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/patient/:patientId', authMiddleware, updatePatientOdontogram);

/**
 * @swagger
 * /api/odontograms/patient/{patientId}/tooth/{toothNumber}:
 *   patch:
 *     summary: Update condition, surfaces, or status for a specific tooth
 *     tags: [Odontograms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: toothNumber
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tooth'
 *     responses:
 *       200:
 *         description: Tooth updated successfully
 *       400:
 *         description: Bad request
 */
router.patch('/patient/:patientId/tooth/:toothNumber', authMiddleware, updateTooth);

/**
 * @swagger
 * /api/odontograms/patient/{patientId}/procedure:
 *   post:
 *     summary: Record a dental procedure or treatment on a tooth
 *     tags: [Odontograms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProcedureInput'
 *     responses:
 *       200:
 *         description: Procedure recorded successfully
 *       400:
 *         description: Bad request
 */
router.post('/patient/:patientId/procedure', authMiddleware, addProcedure);

/**
 * @swagger
 * /api/odontograms/patient/{patientId}/tooth/{toothNumber}/reset:
 *   post:
 *     summary: Reset a single tooth to sound/healthy condition
 *     tags: [Odontograms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: toothNumber
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tooth reset successfully
 *       400:
 *         description: Bad request
 */
router.post('/patient/:patientId/tooth/:toothNumber/reset', authMiddleware, resetTooth);

/**
 * @swagger
 * /api/odontograms/patient/{patientId}/summary:
 *   get:
 *     summary: Get DMFT index and overall dental health statistics
 *     tags: [Odontograms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Odontogram summary retrieved
 *       400:
 *         description: Bad request
 */
router.get('/patient/:patientId/summary', authMiddleware, getSummary);

/**
 * @swagger
 * /api/odontograms/patient/{patientId}/history:
 *   get:
 *     summary: Get audit trail history of changes to the patient's dental chart
 *     tags: [Odontograms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Audit history retrieved
 *       400:
 *         description: Bad request
 */
router.get('/patient/:patientId/history', authMiddleware, getHistory);

export default router;
