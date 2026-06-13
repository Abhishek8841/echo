import type { clientStartTypingType, clientStopTypingType } from "../schemas/client-message.schema.js"
import type { ServerMessageType } from "../schemas/server-message.schema.js"
import { sendToUser } from "../socket-manager.js"

export const sendTypingHandler = (id: string, data: clientStartTypingType) => {
    const sendTypingMessage: ServerMessageType = {
        type: "start_typing",
        payload: {
            from: id,
        }
    }
    sendToUser(data.payload.to, sendTypingMessage);
}

export const stopTypingHandler = (id: string, data: clientStopTypingType) => {
    const stopTypingMessage: ServerMessageType = {
        type: "stop_typing",
        payload: {
            from: id,
        }
    }
    sendToUser(data.payload.to, stopTypingMessage);
}