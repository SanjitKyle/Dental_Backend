import express from 'express';
import * as queueController from '../controllers/queue.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Queue
 *   description: Clinic Token & Live Queue Management
 */

/**
 * @swagger
 * /api/queue/issue:
 *   post:
 *     summary: Issue a new queue token (Authenticated)
 *     description: If patientId is provided, links existing patient. If omitted, inter-service calls patient-service to register walk-in.
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IssueTokenRequest'
 *     responses:
 *       201:
 *         description: Queue token successfully issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Queue token issued successfully" }
 *                 data: { $ref: '#/components/schemas/QueueTokenResponse' }
 *       400:
 *         description: Missing doctor details or patient information
 *       401:
 *         description: Unauthorized - Bearer token missing
 *       502:
 *         description: Failed communicating with patient-service
 */
router.post('/issue', authMiddleware, queueController.issueToken);

/**
 * @swagger
 * /api/queue/walk-in:
 *   post:
 *     summary: Issue token for walk-in patient (Public / Kiosk check-in)
 *     description: Issue a token without requiring receptionist authentication (self-service kiosk mode).
 *     tags: [Queue]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IssueTokenRequest'
 *     responses:
 *       201:
 *         description: Queue token issued for kiosk walk-in
 *       400:
 *         description: Bad request
 */
router.post('/walk-in', queueController.issueToken);

/**
 * @swagger
 * /api/queue/live/{doctorId}:
 *   get:
 *     summary: Get doctor's live queue board
 *     description: Returns active tokens (WAITING and IN_CONSULTATION) for the doctor, prioritized by urgency and token sequence.
 *     tags: [Queue]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Doctor ID (e.g. DOC-101)
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date formatted as YYYY-MM-DD (defaults to today)
 *     responses:
 *       200:
 *         description: Array of live queue tokens ordered by clinical urgency
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: number, example: 3 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QueueTokenResponse'
 */
router.get('/live/:doctorId', queueController.getLiveQueue);

/**
 * @swagger
 * /api/queue/{id}/status:
 *   patch:
 *     summary: Advance or update token status
 *     description: Transitions token lifecycle (WAITING -> IN_CONSULTATION -> COMPLETED, or SKIPPED/CANCELLED). Automatically tracks timestamps.
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Queue Token ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusUpdateRequest'
 *     responses:
 *       200:
 *         description: Token status updated successfully
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Token not found
 */
router.patch('/:id/status', authMiddleware, queueController.updateStatus);

/**
 * @swagger
 * /api/queue:
 *   get:
 *     summary: List all tokens with pagination and filters
 *     description: Retrieve historical or daily tokens for reporting and audit logs.
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: doctorId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ALL, WAITING, IN_CONSULTATION, COMPLETED, SKIPPED, CANCELLED] }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Paginated queue token records
 */
router.get('/', authMiddleware, queueController.listTokens);

export default router;
