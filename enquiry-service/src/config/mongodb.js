import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI ;
        mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully for Enquiry Service');
    } catch (error) {
        console.error('MongoDB connection failed for Enquiry Service:', error.message);
        process.exit(1);
    }
};

export default connectDB;
