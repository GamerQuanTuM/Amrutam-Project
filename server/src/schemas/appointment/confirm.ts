import { z } from "zod";

export const confirmRequest = z.object({
    slotId: z.string().uuid("Invalid UUID format"),
    doctorId: z.string().uuid("Invalid UUID format"),
});



export const confirmResponse = z.object({
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


export type ConfirmRequestType = z.infer<typeof confirmRequest>
export type ConfirmResponseType = z.infer<typeof confirmResponse>