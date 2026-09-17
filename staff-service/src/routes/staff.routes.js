import express from 'express';
import {
    createStaff,
    getStaff,
    getStaffById,
    updateStaff,
    deleteStaff
} from '../controller/staff.controller.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - phoneNumber
 *         - employment
 *         - department
 *       properties:
 *         fullName:
 *           type: string
 *           description: Staff full name
 *         email:
 *           type: string
 *           description: Staff email
 *         phoneNumber:
 *           type: string
 *           description: Staff phone number
 *         emergencyContact:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             relation:
 *               type: string
 *             phone:
 *               type: string
 *         employment:
 *           type: string
 *           description: Staff employment type (NURSE, RECEPTIONIST, ADMIN, TECHNICIAN, BILLING)
 *         designation:
 *           type: string
 *           description: Specific job title
 *         department:
 *           type: string
 *           description: Staff department
 *         employmentType:
 *           type: string
 *           description: Type of employment (FULL_TIME, PART_TIME, CONTRACT)
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of granular permissions
 *         dateOfJoining:
 *           type: string
 *           format: date-time
 *           description: Date the staff member joined
 *         status:
 *           type: string
 *           description: Current employment status (ACTIVE, ON_LEAVE, SUSPENDED, TERMINATED)
 *         createdBy:
 *           type: string
 *           description: ID of the user who created this record
 */

/**
 * @swagger
 * /api/staff:
 *   post:
 *     summary: Create a new staff member
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       201:
 *         description: Staff created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', createStaff);

/**
 * @swagger
 * /api/staff:
 *   get:
 *     summary: Returns the list of all the staff
 *     tags: [Staff]
 *     responses:
 *       200:
 *         description: The list of the staff
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Staff'
 */
router.get('/', getStaff);

/**
 * @swagger
 * /api/staff/{id}:
 *   get:
 *     summary: Get the staff member by id
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The staff id
 *     responses:
 *       200:
 *         description: The staff description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       404:
 *         description: The staff was not found
 */
router.get('/:id', getStaffById);

/**
 * @swagger
 * /api/staff/{id}:
 *   put:
 *     summary: Update the staff by the id
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The staff id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       200:
 *         description: The staff was updated
 *       404:
 *         description: The staff was not found
 *       400:
 *         description: Bad request
 */
router.put('/:id', updateStaff);

/**
 * @swagger
 * /api/staff/{id}:
 *   delete:
 *     summary: Remove the staff by id
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The staff id
 *     responses:
 *       200:
 *         description: The staff was deleted
 *       404:
 *         description: The staff was not found
 */
router.delete('/:id', deleteStaff);

export default router;
