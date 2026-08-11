import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { setupSwagger } from './config/swagger.js';
import connectDb from './config/Mongodb.js';

const app = express();
app.use(cors());
app.use(express.json());

import doctorRoutes from './routes/doctor.routes.js';

setupSwagger(app);
app.use('/api/doctors', doctorRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDb();
});
