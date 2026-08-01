
import User from '../models/user.model.js'
export const RegisterNewUser=async(data)=>{
    try{
        const newUser=await User.create(data);
        return newUser;

    }catch(error)
    {
        console.log('error',error);
        throw error;
    }
}
export const GetUserByEmail=async(email)=>{
    try{
        const user=await User.findOne({email});
        return user;


    }catch(error)
    {
        console.log('error',error);
        throw error;
    }
}