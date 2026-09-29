import crypto from 'crypto';
if (!globalThis.crypto) {
    globalThis.crypto = crypto;
}

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: new URL('../../.env', import.meta.url) });
export const Connect=async()=>{
    try{
      const res=await mongoose.connect(process.env.MONGO_URI);
      if(res){
        console.log('invoice  mongodb successfully connected')
      }
    }catch(error)
    {
        throw error;
    }
}