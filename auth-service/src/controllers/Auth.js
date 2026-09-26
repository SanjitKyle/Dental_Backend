import bcrypt from 'bcryptjs';
import { GetUserByEmail, RegisterNewUser } from "../repository/user.js";
import generateToken from "../utils/jwt.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const RegisterUser = catchAsync(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }

    const existingUser = await GetUserByEmail(email);
    if (existingUser) {
        throw new AppError("User already exists with this email", 409);
    }

    const newUser = await RegisterNewUser({ name, email, password, role });
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: newUser
    });
});

export const LoginUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError("Please provide email and password", 400);
    }

    const existingUser = await GetUserByEmail(email);
    if (!existingUser) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = await generateToken({
        _id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role
    });

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
            token,
            user: existingUser
        }
    });
});