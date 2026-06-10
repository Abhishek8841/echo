import z from "zod";

export const clientMessageSchema = z.object({
    type: z.literal("send_message"),
    payload: z.object({
        to: z.string().uuid(),
        content: z.string().trim().min(1),
    })
})

export type clientMessageType = z.infer<typeof clientMessageSchema>;