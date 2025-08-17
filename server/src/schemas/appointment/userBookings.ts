import { z } from "zod";

export const userBookingsResponse = z.object({
    bookings: z.array(z.object({
        id: z.string(),
        doctorId: z.string(),
        doctor: z.object({
            id: z.string(),
            mode: z.enum(["ONLINE", "IN_PERSON"]),
            specialization: z.enum([
                "SKIN_CARE",
                "DIGESTIVE_ISSUES",
                "RESPIRATORY_CARE",
                "JOINT_PAIN",
                "MENTAL_WELLNESS",
                "GENERAL_CONSULTATION",
                "WOMENS_HEALTH",
                "PEDIATRIC_CARE"
            ]),
            user: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
                role: z.enum(["DOCTOR", "USER", "ADMIN"]),
            })
        }),
        startTime: z.string().datetime({ offset: true }),
        endTime: z.string().datetime({ offset: true }),
        isBooked: z.boolean(),
        lockedBy: z.string().nullable(),
        lockedAt: z.string().datetime({ offset: true }).nullable(),
        lockExpiry: z.string().datetime({ offset: true }).nullable(),
    })),
});



export type UserBookingsResponseType = z.infer<typeof userBookingsResponse>