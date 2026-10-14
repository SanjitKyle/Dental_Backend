import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// 1. Create Patient: requires full_name, allows other clinical & demographic fields via .passthrough()
export const createPatientSchema = z.object({
    body: z.object({
        full_name: z.string().min(2, "Name must be at least 2 characters"),
        phone: z.union([z.string(), z.number()]).optional(),
        email: z.string().email("Invalid email address").optional().or(z.literal('')),
        gender: z.enum(['Male', 'Female', 'Other']).optional(),
        clinicId: z.string().optional()
    }).passthrough()
});

// 2. Update Patient: validates URL ID and allows any dummy update body
export const updatePatientSchema = z.object({
    params: z.object({
        id: z.string().regex(objectIdRegex, "Invalid Patient ID format in URL")
    }),
    body: z.object({}).passthrough()
});

// 3. ID Param Validation: ensures URL :id is a valid 24-character MongoDB ID
export const patientIdParamSchema = z.object({
    params: z.object({
        id: z.string().regex(objectIdRegex, "Invalid Patient ID format in URL")
    })
});