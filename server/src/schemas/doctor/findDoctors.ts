import { z } from "zod";

export const findDoctorsRequest = z.object({
  specialization: z.enum(["SKIN_CARE", "DIGESTIVE_ISSUES", "RESPIRATORY_CARE", "JOINT_PAIN", "MENTAL_WELLNESS", "GENERAL_CONSULTATION", "WOMENS_HEALTH", "PEDIATRIC_CARE"]).optional(),
  mode: z.enum(["ONLINE", "IN_PERSON"]).optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});


export const findDoctorsResponse = z.object({
  doctors: z.array(
    z.object({
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
    })
  ),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});


export type FindDoctorsRequestType = z.infer<typeof findDoctorsRequest>
export type FindDoctorsResponseType = z.infer<typeof findDoctorsResponse>