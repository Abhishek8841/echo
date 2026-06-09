import { z } from "zod";

export const userIdSchema = z.object({
    id: z
        .string()
        .cuid()
});


export type userIdType = z.infer<typeof userIdSchema>;