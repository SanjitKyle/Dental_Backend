import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './config/mongodb.js';
import { setupSwagger } from './config/swagger.js';
import OdontogramRouter from './routes/odontogram.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5005;

// Routes
app.use('/api/odontograms', OdontogramRouter);

// Swagger Documentation
setupSwagger(app);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'odontogram-service' });
});

app.listen(PORT, () => {
    console.log(`Odontogram service is running on port ${PORT}`);
    connectDB();
});
