import crypto from 'crypto';
if (!globalThis.crypto) {
    globalThis.crypto = crypto;
}

import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './config/mongodb.js';
import { setupSwagger } from './config/swagger.js';
import PrescriptionRouter from './routes/prescription.routes.js';
import AppError from './utils/AppError.js';
import globalErrorHandler from './middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5006;

// Routes
app.use('/api/prescriptions', PrescriptionRouter);

// Swagger Documentation
setupSwagger(app);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'prescription-service' });
});

// 1. Catch 404 for unhandled routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 2. Global Error Handling Middleware
app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
    console.log(`Prescription service is running on port ${PORT}`);
    connectDB();
});

// 3. Graceful shutdown on unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥', err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
