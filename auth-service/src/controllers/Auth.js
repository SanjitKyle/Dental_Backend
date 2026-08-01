
import bcrypt from 'bcryptjs';
import { GetUserByEmail, RegisterNewUser } from "../repository/user.js";
import generateToken from "../utils/jwt.js";
export const RegisterUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await GetUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                message: "user already exists with this email",
                success: false
            })
        }
        const newUser = await RegisterNewUser({ name, email, password, role });
        console.log('new user ', newUser);
        return res.status(201).json({
            message: "user registered successfully",
            success: true,
            data: newUser
        })

    } catch (error) {
        console.log('error', error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}
export const LoginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const existingUser=await GetUserByEmail(email);
        if(!existingUser)
        {
            return res.status(400).json({
                message:"user does not exist with this email",
                success:false
            })
        }
        
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }
        const token=await generateToken({id:existingUser._id,email:existingUser.email,role:existingUser.role});

        return res.status(200).json({
            message:"user logged in successfully",
            success:true,
            data:{
                token,
                user:existingUser
            }
        })

    }catch(error)
    {
        console.log('error',error);
        return res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}