import bcrypt from 'bcryptjs';
import { GetUserByEmail, RegisterNewUser } from "../repository/user.js";
import generateToken from "../utils/jwt.js";
import AppError from "../utils/AppError.js";

export const RegisterUser = async (req, res, next) => {
    try {
        const { name, email, password, role, clinicId, clinicName, phone } = req.body;

        if (!email || !password) {
            return next(new AppError("Email and password are required", 400));
        }

        const existingUser = await GetUserByEmail(email);
        if (existingUser) {
            return next(new AppError("User already exists with this email", 409));
        }

        const newUser = await RegisterNewUser({ name, email, password, role, clinicId, clinicName, phone });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        });

    } catch (err) {
        next(err);
    }
};

export const LoginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError("Please provide email and password", 400));
        }

        const existingUser = await GetUserByEmail(email);
        if (!existingUser) {
            return next(new AppError("Invalid email or password", 401));
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return next(new AppError("Invalid email or password", 401));
        }

        existingUser.lastLogin = new Date();
        await existingUser.save();

        const token = await generateToken({
            _id: existingUser._id,
            email: existingUser.email,
            role: existingUser.role,
            clinicId: existingUser.clinicId || null,
            clinicName: existingUser.clinicName || null,
            name: existingUser.name
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                token,
                user: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role,
                    clinicId: existingUser.clinicId || null,
                    clinicName: existingUser.clinicName || null
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * 🏢 1. Sign up as Clinic Owner (Self-service SaaS Onboarding)
 * Creates the Clinic in clinic-service and creates the clinic_admin User in auth-service.
 */
export const RegisterClinic = async (req, res, next) => {
    try {
        const { clinicName, ownerName, email, password, phone, city, state, address } = req.body;

        if (!clinicName || !ownerName || !email || !password || !phone) {
            return next(new AppError("Clinic name, owner name, email, phone, and password are required", 400));
        }

        const cleanEmail = email.toLowerCase().trim();
        const existingUser = await GetUserByEmail(cleanEmail);
        if (existingUser) {
            return next(new AppError("An account with this email already exists", 409));
        }

        // Call clinic-service over HTTP to initialize the clinic tenant record
        const clinicServiceUrl = process.env.CLINIC_SERVICE_URL || 'http://127.0.0.1:5012/api/clinics';
        let clinicRecord = null;
        try {
            const clinicRes = await fetch(`${clinicServiceUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clinicName: clinicName.trim(),
                    ownerName: ownerName.trim(),
                    ownerEmail: cleanEmail,
                    password,
                    phone: String(phone).trim(),
                    city: city || '',
                    state: state || '',
                    address: address || ''
                })
            });

            const clinicJson = await clinicRes.json();
            if (clinicRes.ok && clinicJson.data) {
                clinicRecord = clinicJson.data;
            } else if (!clinicRes.ok) {
                return next(new AppError(clinicJson.message || "Failed creating clinic record", clinicRes.status));
            }
        } catch (fetchErr) {
            console.warn("[auth-service] clinic-service unreachable, fallback to local creation:", fetchErr.message);
        }

        const clinicId = clinicRecord ? clinicRecord._id : null;

        // Fetch or verify user created by clinic-service, or register if standalone
        let user = await GetUserByEmail(cleanEmail);
        if (!user) {
            user = await RegisterNewUser({
                name: ownerName.trim(),
                email: cleanEmail,
                password,
                phone: String(phone).trim(),
                role: 'clinic_admin',
                clinicId: clinicId ? String(clinicId) : null,
                clinicName: clinicName.trim()
            });
        }

        // Auto-login and issue JWT
        const token = await generateToken({
            _id: user._id,
            email: user.email,
            role: user.role,
            clinicId: user.clinicId || null,
            clinicName: user.clinicName || null,
            name: user.name
        });

        res.status(201).json({
            success: true,
            message: "Clinic and Admin account registered successfully",
            data: {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    clinicId: user.clinicId,
                    clinicName: user.clinicName
                },
                clinic: clinicRecord
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * 👑 2. Create Super Admin Account (Platform Master Owner)
 * Protected by a master secret key (SUPER_ADMIN_SECRET) so nobody can arbitrarily register as platform owner.
 */
export const CreateSuperAdmin = async (req, res, next) => {
    try {
        const { name, email, password, superAdminSecret } = req.body;

        if (!email || !password || !name) {
            return next(new AppError("Name, email, and password are required", 400));
        }

        // Security key verification
        const validSecret = process.env.SUPER_ADMIN_SECRET || 'SUPER_SECRET_PLATFORM_KEY_2026';
        if (superAdminSecret !== validSecret) {
            return next(new AppError("Forbidden: Invalid Super Admin secret key", 403));
        }

        const cleanEmail = email.toLowerCase().trim();
        const existingUser = await GetUserByEmail(cleanEmail);
        if (existingUser) {
            return next(new AppError("User already exists with this email", 409));
        }

        const superAdminUser = await RegisterNewUser({
            name: name.trim(),
            email: cleanEmail,
            password,
            role: 'super_admin',
            clinicId: null, // Super Admin has NO clinicId (accesses all clinics)
            clinicName: 'SaaS Platform Master'
        });

        const token = await generateToken({
            _id: superAdminUser._id,
            email: superAdminUser.email,
            role: 'super_admin',
            clinicId: null,
            name: superAdminUser.name
        });

        res.status(201).json({
            success: true,
            message: "Platform Super Admin created successfully",
            data: {
                token,
                user: {
                    _id: superAdminUser._id,
                    name: superAdminUser.name,
                    email: superAdminUser.email,
                    role: superAdminUser.role
                }
            }
        });
    } catch (err) {
        next(err);
    }
};