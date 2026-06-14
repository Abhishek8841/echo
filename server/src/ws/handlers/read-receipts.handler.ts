import { prisma } from "../../lib/prisma.js"
import type { clientMessageType } from "../schemas/client-message.schema.js";
import type { ServerMessageType } from "../schemas/server-message.schema.js";
import { sendToUser } from "../socket-manager.js"

export const readReceiptsHandler = async (id1: string, msg: clientMessageType) => {
    const readAt = new Date();
    await prisma.message.updateMany(
        {
            where: {
                senderId: msg.payload.to,
                receiverId: id1,
                readAt: null,
            },
            data: {
                readAt,
            }
        }
    )
    const newServerReadReceiptMessage: ServerMessageType = {
        type: "recieve_read_receipt",
        payload: {
            from: id1,
            readAt
        }
    };

    sendToUser(msg.payload.to, newServerReadReceiptMessage);
}