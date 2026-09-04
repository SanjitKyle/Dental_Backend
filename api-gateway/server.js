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
    target:  'https://dental-backend-jekw.onrender.com',
    changeOrigin: true
}));

// Route to Patient Service (assuming it runs on port 5001)
app.use(createProxyMiddleware({
    pathFilter: '/api/patients',
    target:  'https://patient-service-8t30.onrender.com',
    changeOrigin: true
}));

// Route to Doctor Service (assuming it runs on port 5002)
app.use(createProxyMiddleware({
    pathFilter: '/api/doctors',
    target: 'https://doctor-ryff.onrender.com',
    changeOrigin: true
}));

// Route to Appointment Service (assuming it runs on port 5003)
app.use(createProxyMiddleware({
    pathFilter: '/api/appointments',
    target: process.env.APPOINTMENT_SERVICE_URL || 'https://appointment-b0ky.onrender.com',
    changeOrigin: true
}));

// Route to Odontogram Service (assuming it runs on port 5005)
app.use(createProxyMiddleware({
    pathFilter: '/api/odontograms',
    target: process.env.ODONTOGRAM_SERVICE_URL || 'http://127.0.0.1:5005',
    changeOrigin: true
}));

// Route to Prescription Service (assuming it runs on port 5006)
app.use(createProxyMiddleware({
    pathFilter: '/api/prescriptions',
    target: process.env.PRESCRIPTION_SERVICE_URL || 'http://127.0.0.1:5006',
    changeOrigin: true
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('api gateway is running on port ' + PORT);
});
