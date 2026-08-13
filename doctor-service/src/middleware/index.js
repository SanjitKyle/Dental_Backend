// middleware entry point for doctor-service
import jwt from 'jsonwebtoken'
export const Auth=(req, res, next)=>{
    try{
        const header=req,headers,authorization;
        if(!header)
        {
            return res.status(401).json({
                message:"Authorization header is missing",
                success:false
            })
        }
      const token=header.split(" ")[1];
      const decoded=jwt.verify(token,process.env.SECRET_KEY);
      req.user=decoded;
      next()

    }catch(error)
    {
        throw error
    }
}