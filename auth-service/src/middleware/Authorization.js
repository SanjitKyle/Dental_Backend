import jwt from 'jsonwebtoken';
export const Authorization=async(req,res,next)=>{
    try{

        const authHeader=req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                message:"Please Provide a valid token",
                success:false
            })
        }
        const token=authHeader.split(' ')[1];
        const verify=await jwt.verify(token,process.env.SECRET_KEY);
        if(!verify)
        {
            return res.status(401).json({
                message:"Please Provide a valid token",
                success:false
            })
        }
        req.user=verify;
        next();
    }catch(error)
    {
        console.log('error',error);
        return res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}