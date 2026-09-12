import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './config/mongodb.js';
import { setupSwagger } from './config/swagger.js';
import EnquiryRouter from './routes/enquiry.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5007;

// Routes
app.use('/api/enquiries', EnquiryRouter);

// Swagger Documentation
setupSwagger(app);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'enquiry-service' });
});

app.listen(PORT, () => {
    console.log(`Enquiry service is running on port ${PORT}`);
    connectDB();
});
