import express from "express";
import ConnectDB from "./config/mongodb.js"
import dotenv from 'dotenv';
import AuthRouter from "./routes/auth.js";
import { setupSwagger } from "./config/swagger.js";
dotenv.config();
const App=express();
ConnectDB();
App.use(express.json());
App.use(express.urlencoded({extended:true}));
// Middleware to handle JSON syntax errors
App.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ success: false, message: "Invalid JSON payload format" });
    }
    next();
});
App.use(express.urlencoded({extended:true}));
App.use('/api/auth',AuthRouter);
setupSwagger(App);
App.listen(process.env.PORT,()=>{
    
    console.log('auth server is running on port ' + process.env.PORT)
})