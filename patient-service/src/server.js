import crypto from 'crypto';
if (!globalThis.crypto) {
    globalThis.crypto = crypto;
}

import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import Connection from './config/MongoDb.js';
import { setupSwagger } from './config/swagger.js';
import PatientRouter from './routes/patient.routes.js';
import AppError from './utils/AppError.js';
import globalErrorHandler from './middleware/error.middleware.js';

const App = express();
App.use(cors());
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5002;

App.use('/api/patients', PatientRouter);
setupSwagger(App);

// 1. Catch 404 for unhandled routes (Express 5 compatible)
App.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 2. Global Centralized Error Handling Middleware (must be last)
App.use(globalErrorHandler);

const server = App.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
    Connection();
});

// 3. Graceful shutdown on unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥', err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});