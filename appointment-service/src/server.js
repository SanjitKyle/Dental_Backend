import crypto from 'crypto';
if (!globalThis.crypto) {
    globalThis.crypto = crypto;
}

import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { setupSwagger } from './config/swagger.js';
import Connect from './config/mongodbconnection.js';
import AppointmentRouter from './routes/index.js';

const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use('/api/appointments', AppointmentRouter);

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    Connect()
});
