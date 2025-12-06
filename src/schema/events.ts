import {z} from "zod"

export const formEvents = z.object({
    name : z.string().min(1, "Name is required"),
    description : z.string().optional(),
    durationInMinutes: z.coerce
        .number<number | string>()
        .int()
        .positive("Duration must be a positive integer")
        .max(60*12, "Duration can't exceed 12 hours (720 minutes)"),
    isActive : z.boolean().default(true)
})