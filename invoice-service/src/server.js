import crypto from 'crypto';
if (!globalThis.crypto) {
    globalThis.crypto = crypto;
}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Connect } from './config/Connect.js';
import invoiceRouter from './router/index.js';
import AppError from './utils/AppError.js';
import globalErrorHandler from './middleware/error.middleware.js';

import { setupSwagger } from './config/swagger.js';

dotenv.config();
dotenv.config({ path: new URL('../.env', import.meta.url) });

const App = express();
App.use(cors());
App.use(express.json());
App.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5010;

// Setup Swagger Documentation (/api-docs)
setupSwagger(App);

// Mount Invoice Routes
App.use('/api/invoices', invoiceRouter);

// 1. Unhandled route 404 catcher (Express 5 compatible)
App.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 2. Global Error Handling Middleware (must be last)
App.use(globalErrorHandler);

const server = App.listen(PORT, () => {
    console.log('Invoice service is running on port', PORT);
    Connect();
});

// 3. Graceful shutdown on unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥', err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});