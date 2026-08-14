// middleware entry point for patient-service
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config()
const AuthMiddleWare=async(req , res , next)=>{
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        const token=authHeader.split(" ")[1];
        const decode=jwt.verify(token, process.env.SECRET_KEY);
         req.userId=decode?._id;
         next()
        
    }catch(error)
    {
      res.status(403).json({
        message:"Invalid or expire token"
      })
    }
}
export default AuthMiddleWare