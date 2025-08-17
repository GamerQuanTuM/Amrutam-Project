import { z } from "zod";

export const userAppointmentResponse = z.object({
    bookedAppointments: z.number(),
    completedAppointments: z.number(),
    cancelledAppointments: z.number(),
    totalAppointments: z.number()
});

export type UserAppointmentResponseType = z.infer<typeof userAppointmentResponse>