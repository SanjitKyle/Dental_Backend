import express from 'express';
import * as clinicController from '../controllers/clinic.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clinics
 *   description: Multi-Tenant Dental Clinic Management & SaaS Subscriptions
 */

/**
 * @swagger
 * /api/clinics/register:
 *   post:
 *     summary: Register a new Dental Clinic (Public SaaS Onboarding)
 *     tags: [Clinics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clinicName, ownerName, ownerEmail, password, phone]
 *             properties:
 *               clinicName: { type: string, example: "Apex Dental Care" }
 *               ownerName: { type: string, example: "Dr. Rajesh Gupta" }
 *               ownerEmail: { type: string, example: "dr.rajesh@apexdental.com" }
 *               password: { type: string, example: "Secret123" }
 *               phone: { type: string, example: "+91 98765 43210" }
 *               city: { type: string, example: "Mumbai" }
 *               state: { type: string, example: "Maharashtra" }
 *               address: { type: string, example: "Shop 4, Sunrise Plaza" }
 *     responses:
 *       201:
 *         description: Clinic successfully created with 14-day trial
 */
router.post('/register', clinicController.registerClinic);

/**
 * @swagger
 * /api/clinics/me:
 *   get:
 *     summary: Get profile of logged-in user's clinic (White-label details)
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clinic profile data
 */
router.get('/me', authMiddleware, clinicController.getMyClinic);

/**
 * @swagger
 * /api/clinics/me:
 *   patch:
 *     summary: Update clinic settings, logo, GSTIN, and letterhead
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clinic profile updated
 */
router.patch('/me', authMiddleware, clinicController.updateMyClinic);

/**
 * Super Admin Routes
 */
router.get('/', authMiddleware, clinicController.listClinics);
router.get('/stats/metrics', authMiddleware, clinicController.getMetrics);
router.patch('/:id/status', authMiddleware, clinicController.setClinicActiveStatus);

export default router;
