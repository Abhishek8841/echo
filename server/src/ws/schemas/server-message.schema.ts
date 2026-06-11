import z from "zod";

export const serverMessageSchema = z.object({
    type: z.literal("receive_message"),
    payload: z.object({
        id: z.string(),
        from: z.string(),
        content: z.string().trim().min(1),
        createdAt: z.date(),
    })
})

export type serverMessageType = z.infer<typeof serverMessageSchema>;