import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

async function Connection() {
    try {
        const response = await mongoose.connect(process.env.MONGO_URI);
        console.log('mongodb is successfully connected for staff-service');
    } catch (error) {
        console.log('error', error);
    }
}
export default Connection;
