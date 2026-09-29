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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('api gateway is running on port ' + PORT);
});
