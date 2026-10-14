import { Router } from "express";
import { RegisterUser, LoginUser, RegisterClinic, CreateSuperAdmin } from "../controllers/Auth.js";
const AuthRouter = Router();


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration, Clinic SaaS onboarding, and login APIs
 */

/**
 * @swagger
 * /api/auth/register-clinic:
 *   post:
 *     summary: Sign up as a new Clinic (Self-service SaaS Onboarding)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clinicName, ownerName, email, password, phone]
 *             properties:
 *               clinicName: { type: string, example: "Smile Dental Hospital" }
 *               ownerName: { type: string, example: "Dr. Ananya Sharma" }
 *               email: { type: string, format: email, example: "dr.ananya@smiledental.com" }
 *               password: { type: string, example: "Secret123" }
 *               phone: { type: string, example: "+91 99887 66554" }
 *               city: { type: string, example: "Pune" }
 *               state: { type: string, example: "Maharashtra" }
 *     responses:
 *       201:
 *         description: Clinic created with 14-day free trial and JWT token
 */
AuthRouter.post('/register-clinic', RegisterClinic);

/**
 * @swagger
 * /api/auth/create-super-admin:
 *   post:
 *     summary: Create Platform Super Admin (Master SaaS Owner)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, superAdminSecret]
 *             properties:
 *               name: { type: string, example: "Sanjit (Platform Admin)" }
 *               email: { type: string, format: email, example: "admin@kyleinfotech.co.in" }
 *               password: { type: string, example: "AdminMaster2026!" }
 *               superAdminSecret: { type: string, example: "SUPER_SECRET_PLATFORM_KEY_2026" }
 *     responses:
 *       201:
 *         description: Super Admin account initialized
 *       403:
 *         description: Invalid master secret key
 */
AuthRouter.post('/create-super-admin', CreateSuperAdmin);

AuthRouter.post('/register', RegisterUser);
AuthRouter.post('/login', LoginUser);

export default AuthRouter;

