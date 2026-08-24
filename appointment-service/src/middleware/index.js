// middleware entry point for appointment-service

import mongoose from "mongoose";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config()

export const Auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Please Provide token"
            })
        }
        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decode?._id;
        req.userId = userId;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

}