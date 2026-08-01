import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

async function ConnectDB()
{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI);
        if(conn){
            console.log('Auth mongodb connected successfully')
        }

    }catch(error)
    {
        console.log('error while connecting to mongodb',error)
    }
}
export default ConnectDB;
