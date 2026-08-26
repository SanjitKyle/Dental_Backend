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
    target: 'http://localhost:5003',
    changeOrigin: true
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('api gateway is running on port ' + PORT);
});
