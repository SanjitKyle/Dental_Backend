import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const userSchema=new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unqiue:true, 
    },
    password:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default:false

    },
    isActive:{
        type:Boolean,
        default:true
    },
    lastLogin:{
        type:Date,
        default: null,
    },
    role:{
        type:String,
        enum:['admin','doctor','patient','staff'],
    }
},{timestamps:true});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});
const User=mongoose.model('User',userSchema);
export default User;
