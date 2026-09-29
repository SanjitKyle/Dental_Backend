import { z } from 'zod';

export const createStafValidate = z.schema({
    body: z.object({
        fullName: z.string({ required_error: "Full name is required" }).min(4, "altest full name should have 4 character"),
        email: z.string({ required_error: "Email is required" }),
        phoneNumber: z.union([z.string(), z.number()], {
            required_error: "Phone number is required"
        }).passthrough()
    })
})