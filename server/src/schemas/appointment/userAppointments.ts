import { z } from "zod";


export const userAppointmentsResponse = z.object({
    appointments: z.array(
        z.object({
            bookedAt: z.string(),
            confirmedAt: z.string().nullable(),
            createdAt: z.string(),
            updatedAt: z.string(),
            status: z.enum(["BOOKED", "COMPLETED", "CANCELLED"]),
            id: z.string(),
            patientId: z.string(),
            doctorId: z.string(),
            doctor: z.object({
                id: z.string(),
                specialization: z.string(),
                mode: z.string(),
                user: z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string().email(),
                }),
                availability: z.array(
                    z.object({
                        id: z.string(),
                        doctorId: z.string(),
                        startTime: z.string().datetime({ offset: true }),
                        endTime: z.string().datetime({ offset: true }),
                        isBooked: z.boolean(),
                        lockedBy: z.string().nullable(),
                        lockedAt: z.string().datetime({ offset: true }).nullable(),
                        lockExpiry: z.string().datetime({ offset: true }).nullable(),
                    })
                ),
            }),
            slotId: z.string(),
            confirmed: z.boolean(),
            originalSlotId: z.string().nullable(),
            rescheduleCount: z.number(),
        })
    ),
});


export type UserAppointmentsResponseType = z.infer<typeof userAppointmentsResponse>