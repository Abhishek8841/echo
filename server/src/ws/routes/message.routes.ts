import { sendMessage } from "../handlers/send-message.handler.js";

export const handlers = {
    send_message: sendMessage
} as const;