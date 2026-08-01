import express from 'express';
import dotenv from 'dotenv';
dotenv.config()
import cors from 'cors';
import Connection from './config/MongoDb.js';

const App=express();
App.use(cors());
App.use(express.json());
App.use(express.urlencoded({extended:true}));
const PORT=process.env.PORT

App.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`);
    Connection()
})