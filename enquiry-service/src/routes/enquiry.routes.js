import express from 'express';
import {
    createEnquiry,
    getEnquiries,
    getEnquiryById,
    updateEnquiry,
    updateStatus,
    convertEnquiry,
    deleteEnquiry
} from '../controllers/enquiry.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     EnquiryInput:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         phone:
 *           type: string
 *           example: "+91 9876543210"
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         serviceRequested:
 *           type: string
 *           example: "Dental Implants"
 *         preferredDoctorId:
 *           type: string
 *           example: "64f8a12bc9e77b102c890456"
 *         preferredDoctorName:
 *           type: string
 *           example: "Dr. Smith"
 *         preferredDate:
 *           type: string
 *           example: "2026-09-20"
 *         preferredTime:
 *           type: string
 *           example: "10:30 AM"
 *         message:
 *           type: string
 *           example: "Looking for consultation regarding lower jaw dental implant."
 *         source:
 *           type: string
 *           enum: [Website, Phone Call, Walk-in, Social Media, Google Ad, Referral, Other]
 *           example: "Website"
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High, Urgent]
 *           example: "Medium"
 *     FollowUpInput:
 *       type: object
 *       required:
 *         - note
 *       properties:
 *         note:
 *           type: string
 *           example: "Called patient; interested in weekend appointment."
 *         nextFollowUpDate:
 *           type: string
 *           format: date
 *           example: "2026-09-15"
 *         status:
 *           type: string
 *           enum: [New, Contacted, Follow-up Needed, Converted, Lost, Closed]
 *           example: "Follow-up Needed"
 */

/**
 * @swagger
 * tags:
 *   name: Enquiries
 *   description: Dental Lead & Patient Enquiry management API
 */

/**
 * @swagger
 * /api/enquiries:
 *   post:
 *     summary: Submit a new enquiry (Public or Staff)
 *     tags: [Enquiries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnquiryInput'
 *     responses:
 *       201:
 *         description: Enquiry submitted successfully
 *       400:
 *         description: Bad request
 */
router.post('/', createEnquiry);



/**
 * @swagger
 * /api/enquiries:
 *   get:
 *     summary: Get all enquiries with filtering and pagination
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [New, Contacted, Follow-up Needed, Converted, Lost, Closed]
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: List of enquiries
 */
router.get('/', authMiddleware, getEnquiries);

/**
 * @swagger
 * /api/enquiries/{id}:
 *   get:
 *     summary: Get enquiry details by ID
 *     tags: [Enquiries]
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
 *         description: Enquiry details
 *       404:
 *         description: Enquiry not found
 */
router.get('/:id', authMiddleware, getEnquiryById);

/**
 * @swagger
 * /api/enquiries/{id}:
 *   put:
 *     summary: Update enquiry details
 *     tags: [Enquiries]
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
 *         description: Enquiry updated successfully
 */
router.put('/:id', authMiddleware, updateEnquiry);



/**
 * @swagger
 * /api/enquiries/{id}/status:
 *   patch:
 *     summary: Update enquiry status
 *     tags: [Enquiries]
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
 *                 enum: [New, Contacted, Follow-up Needed, Converted, Lost, Closed]
 *               cancellationReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', authMiddleware, updateStatus);

/**
 * @swagger
 * /api/enquiries/{id}/convert:
 *   post:
 *     summary: Mark lead as Converted to patient/appointment
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               convertedPatientId:
 *                 type: string
 *               convertedAppointmentId:
 *                 type: string
 *               createPatient:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Enquiry marked as converted
 */
router.post('/:id/convert', authMiddleware, convertEnquiry);

/**
 * @swagger
 * /api/enquiries/{id}:
 *   delete:
 *     summary: Delete enquiry
 *     tags: [Enquiries]
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
 *         description: Enquiry deleted
 */
router.delete('/:id', authMiddleware, deleteEnquiry);

export default router;
