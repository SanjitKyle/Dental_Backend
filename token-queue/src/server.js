import crypto from 'crypto';
if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}

import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import connectDB from './config/db.js';
import setupSwagger from './config/swagger.js';
import queueRoutes from './routes/queue.routes.js';
import AppError from './utils/AppError.js';
import globalErrorHandler from './middleware/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 5011;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
setupSwagger(app);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'token-queue' });
});


// Queue API Routes
app.use('/api/queue', queueRoutes);

// 404 Route Catcher
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on token-queue service!`, 404));
});

// Centralized Error Handling Middleware
app.use(globalErrorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`[token-queue] Microservice running on port ${PORT}`);
  connectDB();
});

// Process-level safety net
process.on('unhandledRejection', (err) => {
  console.error('[token-queue] UNHANDLED REJECTION! 💥', err.name, err.message);
  server.close(() => process.exit(1));
});