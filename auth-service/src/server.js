import crypto from 'crypto';
if (!globalThis.crypto) {
    globalThis.crypto = crypto;
}

import express from "express";
import ConnectDB from "./config/mongodb.js";
import dotenv from 'dotenv';
import cors from 'cors';
import AuthRouter from "./routes/auth.js";
import { setupSwagger } from "./config/swagger.js";
import AppError from "./utils/AppError.js";
import globalErrorHandler from "./middleware/error.middleware.js";

dotenv.config();

const App = express();
App.use(cors());
ConnectDB();

App.use(express.json());
App.use(express.urlencoded({ extended: true }));

// Middleware to handle JSON syntax errors
App.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ success: false, message: "Invalid JSON payload format" });
    }
    next();
});

App.use('/api/auth', AuthRouter);
setupSwagger(App);

// 1. Catch 404 for unhandled routes
App.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 2. Global Error Handling Middleware
App.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
const server = App.listen(PORT, () => {
    console.log('auth server is running on port ' + PORT);
});

// 3. Graceful shutdown on unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥', err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});