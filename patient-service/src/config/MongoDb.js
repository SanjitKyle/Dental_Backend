import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()
// config entry point for patient-service
async function Connection()
{
    try{
        const response=await mongoose.connect(process.env.MONGO_URI);
        console.log('mongodb is successfully connected');
        

    }catch(error)
    {
        console.log('error',error);

    }

}
export default Connection;