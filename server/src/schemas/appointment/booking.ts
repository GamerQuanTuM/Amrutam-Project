import { z } from "zod";

export const bookingRequest = z.object({
    slotId: z.string().uuid("Invalid UUID format"),
});


export const bookingResponse = z.object({
    id: z.string(),
    doctorId: z.string(),
    startTime: z.string().datetime({ offset: true }),
    endTime: z.string().datetime({ offset: true }),
    isBooked: z.boolean(),
    lockedBy: z.string().nullable(),
    lockedAt: z.string().datetime({ offset: true }).nullable(),
    lockExpiry: z.string().datetime({ offset: true }).nullable(),
})


export type BookingRequestType = z.infer<typeof bookingRequest>
export type BookingResponseType = z.infer<typeof bookingResponse>