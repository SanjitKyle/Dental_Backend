import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { setupSwagger } from './config/swagger.js';

const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server is running on port ${PORT}");
});
