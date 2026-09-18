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

// Route to Auth Service
app.use(createProxyMiddleware({
    pathFilter: '/api/auth',
    target: 'http://127.0.0.1:5001',
    changeOrigin: true
}));

// Route to Patient Service
app.use(createProxyMiddleware({
    pathFilter: '/api/patients',
    target: 'http://127.0.0.1:5002',
    changeOrigin: true
}));

// Route to Doctor Service
app.use(createProxyMiddleware({
    pathFilter: '/api/doctors',
    target: 'http://127.0.0.1:5003',
    changeOrigin: true
}));

// Route to Appointment Service
app.use(createProxyMiddleware({
    pathFilter: '/api/appointments',
    target: 'http://127.0.0.1:5004',
    changeOrigin: true
}));

// Route to Odontogram Service
app.use(createProxyMiddleware({
    pathFilter: '/api/odontograms',
    target: 'http://127.0.0.1:5005',
    changeOrigin: true
}));

// Route to Prescription Service
app.use(createProxyMiddleware({
    pathFilter: '/api/prescriptions',
    target: 'http://127.0.0.1:5006',
    changeOrigin: true
}));

// Route to Enquiry Service
app.use(createProxyMiddleware({
    pathFilter: '/api/enquiries',
    target: 'http://127.0.0.1:5007',
    changeOrigin: true
}));

// Route to Staff Service
app.use(createProxyMiddleware({
    pathFilter: '/api/staff',
    target: 'http://127.0.0.1:5008',
    changeOrigin: true
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('api gateway is running on port ' + PORT);
});
