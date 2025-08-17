import { z } from "zod";

export const rescheduleRequest = z.object({
    appointmentId: z.string().uuid("Invalid UUID format"),
    newSlotId: z.string().uuid("Invalid UUID format"),
});



export const rescheduleResponse = z.object({
    id: z.string().uuid("Invalid UUID format"),
    slotId: z.string().uuid("Invalid UUID format"),
    patientId: z.string().uuid("Invalid UUID format"),
    doctorId: z.string().uuid("Invalid UUID format"),
    status: z.enum(["BOOKED", "COMPLETED", "CANCELLED"]),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
    confirmed: z.boolean(),
    bookedAt: z.string().datetime({ offset: true }),
    confirmedAt: z.string().datetime({ offset: true }).nullable(),
    originalSlotId: z.string().uuid("Invalid UUID format").nullable(),
    rescheduleCount: z.number(),
})


export type RescheduleRequestType = z.infer<typeof rescheduleRequest>
export type RescheduleResponseType = z.infer<typeof rescheduleResponse>