import crypto from 'crypto';
if (!globalThis.crypto) {
    globalThis.crypto = crypto;
}

import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { setupSwagger } from './config/swagger.js';
import connectDb from './config/Mongodb.js';
import doctorRoutes from './routes/doctor.routes.js';
import AppError from './utils/AppError.js';
import globalErrorHandler from './middleware/error.middleware.js';

const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app);
app.use('/api/doctors', doctorRoutes);

// 1. Catch 404 for unhandled routes (Express 5 compatible)
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 2. Global Error Handling Middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5003;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDb();
});

// 3. Graceful shutdown on unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥', err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
