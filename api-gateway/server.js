const express = require('express');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Route to Auth Service (Port 5001)
app.use(createProxyMiddleware({
    pathFilter: '/api/auth',
    target: process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:5001',
    changeOrigin: true
}));

// Route to Patient Service (Port 5002)
app.use(createProxyMiddleware({
    pathFilter: '/api/patients',
    target: process.env.PATIENT_SERVICE_URL || 'http://127.0.0.1:5002',
    changeOrigin: true
}));

// Route to Doctor Service (Port 5003)
app.use(createProxyMiddleware({
    pathFilter: '/api/doctors',
    target: process.env.DOCTOR_SERVICE_URL || 'http://127.0.0.1:5003',
    changeOrigin: true
}));

// Route to Appointment Service (Port 5004)
app.use(createProxyMiddleware({
    pathFilter: '/api/appointments',
    target: process.env.APPOINTMENT_SERVICE_URL || 'http://127.0.0.1:5004',
    changeOrigin: true
}));

// Route to Odontogram Service (Port 5005)
app.use(createProxyMiddleware({
    pathFilter: '/api/odontograms',
    target: process.env.ODONTOGRAM_SERVICE_URL || 'http://127.0.0.1:5005',
    changeOrigin: true
}));

// Route to Prescription Service (Port 5006)
app.use(createProxyMiddleware({
    pathFilter: '/api/prescriptions',
    target: process.env.PRESCRIPTION_SERVICE_URL || 'http://127.0.0.1:5006',
    changeOrigin: true
}));

// Route to Enquiry Service (Port 5007)
app.use(createProxyMiddleware({
    pathFilter: '/api/enquiries',
    target: process.env.ENQUIRY_SERVICE_URL || 'http://127.0.0.1:5007',
    changeOrigin: true
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('api gateway is running on port ' + PORT);
});
