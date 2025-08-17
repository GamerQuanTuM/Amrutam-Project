import { z } from "zod";

export const cancelRequest = z.object({
    appointmentId: z.string().uuid("Invalid UUID format"),
});



export const cancelResponse = z.string()


export type CancelRequestType = z.infer<typeof cancelRequest>
export type CancelResponseType = z.infer<typeof cancelResponse>