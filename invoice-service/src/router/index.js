import express from 'express';
import {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
} from '../controller/index.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LineItem:
 *       type: object
 *       required:
 *         - description
 *         - rate
 *       properties:
 *         description:
 *           type: string
 *           example: "Root Canal Treatment"
 *         qty:
 *           type: number
 *           default: 1
 *           example: 1
 *         rate:
 *           type: number
 *           example: 3500
 *         discount:
 *           type: number
 *           default: 0
 *           description: Percentage discount (0-100)
 *           example: 10
 *         amount:
 *           type: number
 *           description: Auto-computed line item total
 *           example: 3150
 *
 *     Invoice:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6704b2e8a1b2c3d4e5f6a7b8"
 *         invoiceNumber:
 *           type: string
 *           example: "INV-2026-001"
 *         patientId:
 *           type: string
 *           example: "66f7f6a2b891823a01b9201a"
 *         doctorId:
 *           type: string
 *           example: "66f7f6c3b891823a01b9202b"
 *         appointmentId:
 *           type: string
 *           example: "66f7f6e4b891823a01b9203c"
 *         invoiceDate:
 *           type: string
 *           format: date-time
 *           example: "2026-09-28T09:30:00.000Z"
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: "2026-10-05T00:00:00.000Z"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LineItem'
 *         subtotal:
 *           type: number
 *           example: 3750
 *         taxPercent:
 *           type: number
 *           example: 18
 *         taxAmount:
 *           type: number
 *           example: 675
 *         totalAmount:
 *           type: number
 *           example: 4425
 *         paymentMethod:
 *           type: string
 *           enum: [Cash, Credit Card, Debit Card, UPI, Bank Transfer, Insurance]
 *           example: "UPI"
 *         paymentDate:
 *           type: string
 *           format: date-time
 *           example: "2026-09-28T09:35:00.000Z"
 *         status:
 *           type: string
 *           enum: [Pending, Paid, Overdue, Cancelled]
 *           example: "Paid"
 *         notes:
 *           type: string
 *           example: "Paid via clinic reception QR code"
 *         createdBy:
 *           type: string
 *           example: "66f7f611b891823a01b92000"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateInvoiceInput:
 *       type: object
 *       required:
 *         - patientId
 *         - items
 *       properties:
 *         patientId:
 *           type: string
 *           example: "66f7f6a2b891823a01b9201a"
 *         doctorId:
 *           type: string
 *           example: "66f7f6c3b891823a01b9202b"
 *         appointmentId:
 *           type: string
 *           example: "66f7f6e4b891823a01b9203c"
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - description
 *               - rate
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Dental Cleaning & Polishing"
 *               qty:
 *                 type: number
 *                 default: 1
 *                 example: 1
 *               rate:
 *                 type: number
 *                 example: 1500
 *               discount:
 *                 type: number
 *                 default: 0
 *                 example: 5
 *         taxPercent:
 *           type: number
 *           default: 0
 *           example: 18
 *         paymentMethod:
 *           type: string
 *           enum: [Cash, Credit Card, Debit Card, UPI, Bank Transfer, Insurance]
 *           default: Cash
 *           example: "Cash"
 *         status:
 *           type: string
 *           enum: [Pending, Paid, Overdue, Cancelled]
 *           default: Pending
 *           example: "Pending"
 *         dueDate:
 *           type: string
 *           format: date
 *           example: "2026-10-05"
 *         notes:
 *           type: string
 *           example: "First installment for ortho treatment"
 */

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Billing and invoice management operations
 */

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInvoiceInput'
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Invoice created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Invalid input or missing line items
 */
router.post('/', createInvoice);

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices with pagination & filtering
 *     tags: [Invoices]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Skip count override
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Paid, Overdue, Cancelled]
 *         description: Filter by payment status
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *         description: Filter by patient ID
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *         description: Filter by doctor ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Invoice date start filter (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Invoice date end filter (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of invoices with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Invoice'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 45
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     offset:
 *                       type: integer
 *                       example: 0
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 */
router.get('/', getAllInvoices);

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB Invoice ID
 *     responses:
 *       200:
 *         description: Invoice found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Invoice not found
 */
router.get('/:id', getInvoiceById);

/**
 * @swagger
 * /api/invoices/{id}:
 *   put:
 *     summary: Update an invoice (recalculates financials if items or tax changed)
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB Invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInvoiceInput'
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Invoice updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Invoice not found
 */
router.put('/:id', updateInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 *   patch:
 *     summary: Partially update invoice (e.g. mark status as Paid)
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB Invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Paid, Overdue, Cancelled]
 *                 example: "Paid"
 *               paymentMethod:
 *                 type: string
 *                 enum: [Cash, Credit Card, Debit Card, UPI, Bank Transfer, Insurance]
 *                 example: "UPI"
 *               notes:
 *                 type: string
 *                 example: "Payment cleared via netbanking"
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Invoice updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Invoice not found
 */
router.patch('/:id', updateInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 *   delete:
 *     summary: Delete an invoice
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB Invoice ID
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Invoice deleted successfully"
 *       404:
 *         description: Invoice not found
 */
router.delete('/:id', deleteInvoice);

export default router;
