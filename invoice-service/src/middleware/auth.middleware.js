import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()
export const MiddleWear=async(res,req,next)=>{
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer '))
        {
            return res.status(500).json({
                message:"unauthorized token "
            })
        }

         const token=authHeader.split(' ')[1];
         const decode=jwt.verify(token,process.env.SECRET_KEY);
         const userId=req.decode?._id
         next()

    }catch(error)
    {
           next(error);
    }
}