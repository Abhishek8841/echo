import z from "zod";

export const sendMessageSchema = z.object({
    type: z.literal("send_message"),
    payload: z.object({
        to: z.string(),
        content: z.string().trim().min(1),
    })
})

export const clientStartTypingSchema = z.object(
    {
        type: z.literal("start_typing"),
        payload: z.object(
            {
                to: z.string()
            }
        )
    }
)

export const clientStopTypingSchema = z.object(
    {
        type: z.literal("stop_typing"),
        payload: z.object(
            {
                to: z.string()
            }
        )
    }
)

export const clientMessageSchema = z.discriminatedUnion("type",
    [
        sendMessageSchema, clientStartTypingSchema, clientStopTypingSchema,
    ]
)

export type sendMessageType = z.infer<typeof sendMessageSchema>;
export type clientMessageType = z.infer<typeof clientMessageSchema>;
export type clientStartTypingType = z.infer<typeof clientStartTypingSchema>;
export type clientStopTypingType = z.infer<typeof clientStopTypingSchema>;