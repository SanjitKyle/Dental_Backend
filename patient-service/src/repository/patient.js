import { patient } from "../models/user.js"

// repository entry point for patient-service
export const patientCreate=async(data)=>{
    try{
        const res=await patient.create(data);
        return  res;
        
    }catch(error)
    { 
        throw error;

    }
}