const express = require('express');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());

// Route to Auth Service
app.use(createProxyMiddleware({
    pathFilter: '/api/auth',
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
    changeOrigin: true
}));

// Route to Patient Service
app.use(createProxyMiddleware({
    pathFilter: '/api/patients',
    target: process.env.PATIENT_SERVICE_URL || 'http://localhost:5002',
    changeOrigin: true
}));

// Route to Doctor Service
app.use(createProxyMiddleware({
    pathFilter: '/api/doctors',
    target: process.env.DOCTOR_SERVICE_URL || 'http://localhost:5003',
    changeOrigin: true
}));

// Route to Appointment Service
app.use(createProxyMiddleware({
    pathFilter: '/api/appointments',
    target: process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:5004',
    changeOrigin: true
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('api gateway is running on port ' + PORT);
});
