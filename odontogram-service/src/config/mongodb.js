import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dental_odontogram_db';
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully for Odontogram Service');
    } catch (error) {
        console.error('MongoDB connection failed for Odontogram Service:', error.message);
        process.exit(1);
    }
};

export default connectDB;
