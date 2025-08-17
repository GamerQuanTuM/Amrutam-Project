import { z } from "zod";

export const currentUserRequest = z.object({
    appointments: z.string().optional(),
});


export const currentUserResponse = z.object({
    id: z.string().uuid("Invalid UUID format"),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(["USER", "DOCTOR", "ADMIN"]),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
})


export type CurrentUserRequestType = z.infer<typeof currentUserRequest>
export type CurrentUserResponseType = z.infer<typeof currentUserResponse>