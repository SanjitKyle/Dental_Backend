import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[clinic-service] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('[clinic-service] MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
