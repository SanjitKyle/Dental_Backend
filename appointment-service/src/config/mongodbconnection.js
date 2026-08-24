// config entry point for appointment-service
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
async function Connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('mongodb is connected successfully');

    } catch (error) {
        console.log('error', error)
    }

}

export default Connect;