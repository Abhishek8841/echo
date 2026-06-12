import z from "zod";

export const serverMessageSchema = z.object({
    type: z.literal("receive_message"),
    payload: z.object({
        id: z.string(),
        content: z.string().trim().min(1),
        senderId: z.string(),
        recieverId: z.string(),
        createdAt: z.date(),
    })
})

export type serverMessageType = z.infer<typeof serverMessageSchema>;


// (alias) type MessagesType = {
//     id: string;
//     content: string;
//     senderId: string;
//     receiverId: string;
//     createdAt: Date;
//     sender: {
//         id: string;
//         email: string;
//     };
// }[]
