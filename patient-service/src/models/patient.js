// models entry point for patient-service
import mongoose from "mongoose";
const Patient = mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },

   last_name:{
    type:String,
    required:true
   },
   date_of_birth:{
    type:Date,
   },

    gender:{
        type:String,
        enum:['Male','Female','Other'],
        default:'Male'
    },
    blood_group:{
        type:String,
       
    },
    phone:{
        type:Number
    },
    email:{
        type:String
    },
    address:{
        type:String
    },
    note:{
        type:String
    
    },
    height:{
        type:String
    },
    weight:{
        type:String
    },
    emergency_contact_name:{
        type:String
    },
    emergencty_contact_phone:{
        type:Number
    },
    relation:{
        type:String
    }

    
    


},{ timestamps: true })

export default mongoose.model('Patient', Patient);