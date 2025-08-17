import { z } from "zod";

export const loginRequest = z.object({
    email: z.string().email().min(1),
    password: z.string().min(1),
});


export const loginResponse = z.object({
    id: z.string().uuid("Invalid UUID format"),
    name: z.string(),
    token: z.string(),
    email: z.string().email(),
    role: z.enum(["USER", "DOCTOR", "ADMIN"]),
    createdAt: z.date(),
    updatedAt: z.date(),
})


export type LoginRequestType = z.infer<typeof loginRequest>
export type LoginResponseType = z.infer<typeof loginResponse>