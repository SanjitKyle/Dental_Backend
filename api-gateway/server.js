const express = require('express');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

dotenv.config();
const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Prevent HTTP Parameter Pollution
app.use(hpp());

// 3. CORS Configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// 4. Rate Limiting (500 requests per 15 minutes per IP)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }
});
app.use('/api', generalLimiter);

// 5. Centralized Swagger Portal for Microservices
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Dental Hospital Microservices API Gateway',
        version: '1.0.0',
        description: 'Unified API Gateway documentation and live endpoints for all 10 microservices.'
    },
    servers: [
        { url: 'https://dentalbackend.kyleinfotech.co.in', description: 'Production API Gateway' },
        { url: 'http://localhost:5000', description: 'Local API Gateway' }
    ],
    tags: [
        { name: 'Auth', description: 'Authentication & RBAC credentials (/api/auth)' },
        { name: 'Patients', description: 'Patient records & profiles (/api/patients)' },
        { name: 'Doctors', description: 'Doctor schedules & specializations (/api/doctors)' },
        { name: 'Appointments', description: 'Clinical booking & slot management (/api/appointments)' },
        { name: 'Queue', description: 'Token walk-in & live clinical queue (/api/queue)' },
        { name: 'Invoices', description: 'GST Tax Invoices & billing (/api/invoices)' },
        { name: 'Prescriptions', description: 'Medications & diagnosis (/api/prescriptions)' },
        { name: 'Odontograms', description: 'Dental teeth charting 3D meshes (/api/odontograms)' },
        { name: 'Enquiries', description: 'Patient inquiries & follow-ups (/api/enquiries)' },
        { name: 'Staff', description: 'Clinic staff & operational rosters (/api/staff)' }
    ],
    paths: {
        '/api/queue/issue': {
            post: {
                tags: ['Queue'],
                summary: 'Issue a new queue token (Auto-registers walk-in if patientId omitted)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['doctorId', 'doctorName'],
                                properties: {
                                    patientId: { type: 'string', example: '65fc23ab47a98810c9d78901' },
                                    patientName: { type: 'string', example: 'Rahul Verma' },
                                    phone: { type: 'string', example: '+91 98765 43210' },
                                    doctorId: { type: 'string', example: 'DOC-101' },
                                    doctorName: { type: 'string', example: 'Dr. Testing3' },
                                    service: { type: 'string', example: 'General Consultation' },
                                    priority: { type: 'string', enum: ['EMERGENCY', 'URGENT', 'SENIOR', 'APPOINTMENT', 'NORMAL'], example: 'URGENT' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Queue token issued successfully' }
                }
            }
        },
        '/api/queue/live/{doctorId}': {
            get: {
                tags: ['Queue'],
                summary: 'Get live urgency queue for a doctor',
                parameters: [
                    { name: 'doctorId', in: 'path', required: true, schema: { type: 'string' }, example: 'DOC-101' }
                ],
                responses: {
                    200: { description: 'Array of live waiting & in-consultation tokens' }
                }
            }
        },
        '/api/queue/{id}/status': {
            patch: {
                tags: ['Queue'],
                summary: 'Transition token status (WAITING -> IN_CONSULTATION -> COMPLETED)',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['status'],
                                properties: {
                                    status: { type: 'string', enum: ['WAITING', 'IN_CONSULTATION', 'COMPLETED', 'SKIPPED', 'CANCELLED'] }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Token status updated' }
                }
            }
        },
        '/api/queue': {
            get: {
                tags: ['Queue'],
                summary: 'Paginated token audit log',
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
                    { name: 'doctorId', in: 'query', schema: { type: 'string' } },
                    { name: 'status', in: 'query', schema: { type: 'string' } }
                ],
                responses: {
                    200: { description: 'Paginated queue tokens' }
                }
            }
        }
    }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Route to Auth Service

app.use(createProxyMiddleware({
    pathFilter: '/api/auth',
    target: process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:5001',
    changeOrigin: true
}));

// Route to Patient Service
app.use(createProxyMiddleware({
    pathFilter: '/api/patients',
    target: process.env.PATIENT_SERVICE_URL || 'http://127.0.0.1:5002',
    changeOrigin: true
}));

// Route to Doctor Service
app.use(createProxyMiddleware({
    pathFilter: '/api/doctors',
    target: process.env.DOCTOR_SERVICE_URL || 'http://127.0.0.1:5003',
    changeOrigin: true
}));

// Route to Appointment Service
app.use(createProxyMiddleware({
    pathFilter: '/api/appointments',
    target: process.env.APPOINTMENT_SERVICE_URL || 'http://127.0.0.1:5004',
    changeOrigin: true
}));

// Route to Odontogram Service
app.use(createProxyMiddleware({
    pathFilter: '/api/odontograms',
    target: process.env.ODONTOGRAM_SERVICE_URL || 'http://127.0.0.1:5005',
    changeOrigin: true
}));

// Route to Prescription Service
app.use(createProxyMiddleware({
    pathFilter: '/api/prescriptions',
    target: process.env.PRESCRIPTION_SERVICE_URL || 'http://127.0.0.1:5006',
    changeOrigin: true
}));

// Route to Enquiry Service
app.use(createProxyMiddleware({
    pathFilter: '/api/enquiries',
    target: process.env.ENQUIRY_SERVICE_URL || 'http://127.0.0.1:5007',
    changeOrigin: true
}));

// Route to Staff Service
app.use(createProxyMiddleware({
    pathFilter: '/api/staff',
    target: process.env.STAFF_SERVICE_URL || 'http://127.0.0.1:5008',
    changeOrigin: true
}));

// Route to Invoice Service
app.use(createProxyMiddleware({
    pathFilter: '/api/invoices',
    target: process.env.INVOICE_SERVICE_URL || 'http://127.0.0.1:5010',
    changeOrigin: true
}));

// Route to Token Queue Service
app.use(createProxyMiddleware({
    pathFilter: '/api/queue',
    target: process.env.QUEUE_SERVICE_URL || 'http://127.0.0.1:5011',
    changeOrigin: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('api gateway is running on port ' + PORT);
});
