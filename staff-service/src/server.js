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

dotenv.config();
const App = express();

App.use(cors());
App.use(express.json());
App.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5008;

App.use('/api/staff', staffRoutes);
setupSwagger(App);

App.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
    Connection();
});