import { prisma } from "../../lib/prisma.js"
import type { clientMessageType } from "../schemas/client-message.schema.js"
import type { serverMessageSchema, ServerMessageType } from "../schemas/server-message.schema.js"
import { getUserSockets } from "../socket-manager.js"

export const sendMessage = async (senderId: string, msg: clientMessageType): Promise<void> => {

    // console.log("send-message1");
    const newMsg = await prisma.message.create(
        {
            data: {
                content: msg.payload.content,
                senderId: senderId,
                receiverId: msg.payload.to,
            }
        }
    )

    // console.log("send-message2");
    const sockets = getUserSockets(newMsg.receiverId);
    for (const socket of sockets ?? []) {
        const serverMessage: ServerMessageType = {
            type: "recieve_message",
            payload: {
                id: newMsg.id,
                senderId: senderId,
                recieverId: msg.payload.to,
                content: newMsg.content,
                createdAt: newMsg.createdAt,
            }
        };

        // console.log("send-message3");
        socket.send(JSON.stringify(serverMessage));
    }
}