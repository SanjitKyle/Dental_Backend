import express from 'express';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors'
dotenv.config();
const app = express();
app.use(cors());
// Route to Auth Service
app.use(createProxyMiddleware({
    pathFilter: '/api/auth',
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:5000',
    changeOrigin: true
}));

// Route to Patient Service (assuming it runs on port 5001)
app.use(createProxyMiddleware({
    pathFilter: '/api/patients',
    target: process.env.PATIENT_SERVICE_URL || 'http://localhost:5001',
    changeOrigin: true
}));

// Route to Doctor Service (assuming it runs on port 5002)
app.use(createProxyMiddleware({
    pathFilter: '/api/doctors',
    target: process.env.DOCTOR_SERVICE_URL || 'http://localhost:5002',
    changeOrigin: true
}));

// Route to Appointment Service (assuming it runs on port 5003)
app.use(createProxyMiddleware({
    pathFilter: '/api/appointments',
    target: process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:5003',
    changeOrigin: true
}));

app.listen(process.env.PORT, () => {
    console.log('api gateway is running on port ' + process.env.PORT)
})