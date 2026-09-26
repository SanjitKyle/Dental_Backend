import crypto from 'crypto';
if (!globalThis.crypto) {
    globalThis.crypto = crypto;
}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Connection from './config/MongoDb.js';
import { setupSwagger } from './config/swagger.js';
import staffRoutes from './routes/staff.routes.js';
import AppError from './utils/AppError.js';
import globalErrorHandler from './middleware/error.middleware.js';

dotenv.config();
const App = express();

App.use(cors());
App.use(express.json());
App.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5008;

App.use('/api/staff', staffRoutes);
setupSwagger(App);

// 1. Catch unhandled routes (404, Express 5 compatible)
App.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 2. Global Centralized Error Handling Middleware
App.use(globalErrorHandler);

const server = App.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
    Connection();
});

// 3. Graceful shutdown on unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥', err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});