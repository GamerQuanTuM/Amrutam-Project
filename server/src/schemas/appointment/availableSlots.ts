import { z } from "zod";

export const availableSlotsRequest = z.object({
    page: z.string().min(1).optional(),
    limit: z.string().min(10).optional()
});


export const availableSlotsResponse =
    z.object({
        slots: z.array(
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

        meta: z.object({
            page: z.number(),
            limit: z.number(),
            total: z.number(),
            totalPages: z.number(),
        }),

    })


export type AvailableSlotsRequestType = z.infer<typeof availableSlotsRequest>
export type AvailableSlotsResponseType = z.infer<typeof availableSlotsResponse>