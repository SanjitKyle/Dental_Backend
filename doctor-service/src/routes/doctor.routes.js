import express from 'express';
import * as DoctorController from '../controllers/doctor.controller.js';
import { Auth } from '../middleware/index.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctor profile management API
 */

/**
 * @swagger
 * /api/doctors:
 *   post:
 *     summary: Create a new doctor profile
 *     tags: [Doctors]
 *     responses:
 *       201:
 *         description: Doctor created successfully
 */
router.post('/', Auth, DoctorController.createDoctor);

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: List of doctors
 */
router.get('/', Auth, DoctorController.getAllDoctors);

/**
 * @swagger
 * /api/doctors/{id}:
 *   get:
 *     summary: Get doctor by database ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor profile details
 */
router.get('/:id', Auth, DoctorController.getDoctorById);

/**
 * @swagger
 * /api/doctors/{id}:
 *   put:
 *     summary: Update doctor details
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 */
router.put('/:id', Auth, DoctorController.updateDoctor);

/**
 * @swagger
 * /api/doctors/{id}:
 *   delete:
 *     summary: Delete a doctor
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 */
router.delete('/:id', Auth, DoctorController.deleteDoctor);

/**
 * @swagger
 * /api/doctors/profile/{userId}:
 *   get:
 *     summary: Get full combined doctor profile (Auth + Doctor details)
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Full profile including auth details
 */
router.get('/profile/:userId', Auth, DoctorController.getDoctorFullProfile);

export default router;
