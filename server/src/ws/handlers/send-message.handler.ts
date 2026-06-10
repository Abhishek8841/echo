import { prisma } from "../../lib/prisma.js"
import type { clientMessageType } from "../schemas/client-message.schema.js"
import type { serverMessageType } from "../schemas/server-message.schema.js"
import { getUserSockets } from "../socket-manager.js"

export const sendMessage = async (senderId: string, msg: clientMessageType): Promise<void> => {
    const newMsg = await prisma.message.create(
        {
            data: {
                content: msg.payload.content,
                senderId: senderId,
                receiverId: msg.payload.to,
            }
        }
    )

    const sockets = getUserSockets(newMsg.receiverId);
    for (const socket of sockets ?? []) {
        const serverMessage: serverMessageType = {
            type: "receive_message",
            payload: {
                id: newMsg.id,
                from: senderId,
                content: newMsg.content,
                createdAt: newMsg.createdAt,
            }
        };
        socket.send(JSON.stringify(serverMessage));
    }
}