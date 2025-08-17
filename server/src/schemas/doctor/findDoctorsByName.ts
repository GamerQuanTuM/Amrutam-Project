import { z } from "zod";

export const findDoctorsByNameRequest = z.object({
    name: z.string()
});

export const findDoctorsByNameResponse = z.array(z.object({
    user: z.object({
        name: z.string(),
        id: z.string(),
        email: z.string()
    }),
    id: z.string(),
    availability: z.array(z.object({
        id: z.string(),
        doctorId: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        isBooked: z.boolean(),
        lockedBy: z.string().nullable(),
        lockedAt: z.string().nullable(),
        lockExpiry: z.string().nullable()
    })),
    specialization: z.string(),
    mode: z.string(),
}));


export type FindDoctorsByNameRequestType = z.infer<typeof findDoctorsByNameRequest>
export type FindDoctorsByNameResponseType = z.infer<typeof findDoctorsByNameResponse>