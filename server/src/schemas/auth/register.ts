import { z } from "zod";

export const registerRequest = z.object({
    name: z.string().min(3),
    email: z.string().email().min(1),
    password: z.string().min(1),
    role: z.enum(["USER", "DOCTOR", "ADMIN"]).default("USER"),
});


export const registerResponse = z.object({
    id: z.string().uuid("Invalid UUID format"),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(["USER", "DOCTOR", "ADMIN"]),
    createdAt: z.date(),
    updatedAt: z.date(),
})


export type RegisterRequestType = z.infer<typeof registerRequest>
export type RegisterResponseType = z.infer<typeof registerResponse>