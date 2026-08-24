import mongoose from "mongoose";

// models entry point for appointment-service
const appointment=mongoose.Schema({
    patient:{
     type:String,
     required:true
    },
    doctor:{
        type:String,
        required:true
    },
    created_by:{
        type:String,
        required:true
    },
    start_time:{
        type:String
    },
    end_time:{
        type:String
    },
    date:{
        type:String
    },
    service:{
        type:String
    },
    status:{
        type:String,
        enum:['Scheduled','Completed','Cancelled','No-Show','Rescheduled']
    },
    visit_type:{
        type:String,
        enum:["Consultation","Follow-up","Routine Checkup","Emergency","Telehealth/Online"]
    },
    reasonForVisit:{
        type:String
    },

});

export const appointMent=mongoose.model("appointMent",appointment);