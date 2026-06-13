import z from "zod";

export const serverReceiveMessageSchema = z.object({
    type: z.literal("recieve_message"),
    payload: z.object({
        id: z.string(),
        content: z.string().trim().min(1),
        senderId: z.string(),
        recieverId: z.string(),
        createdAt: z.date(),
    })
})
 
export const sendStatusSchema = z.object({
    type: z.literal("status_indicator"),
    payload: z.object({
        from: z.string(),
        content: z.enum(["ONLINE", "OFFLINE"]),
    })
})

export const sendOnlineListSchema = z.object({
    type: z.literal("online_list"),
    payload: z.array(z.string())
})

// export const serverMessageSchema = z.union([
//     serverReceiveMessageSchema,
//     sendStatusSchema
// ]);

export const serverMessageSchema =
    z.discriminatedUnion("type", [
        serverReceiveMessageSchema,
        sendStatusSchema,
        sendOnlineListSchema
    ]);

export type ServerMessageType =
    z.infer<typeof serverMessageSchema>;