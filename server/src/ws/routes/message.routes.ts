import { readReceiptsHandler } from "../handlers/read-receipts.handler.js";
import { sendMessage } from "../handlers/send-message.handler.js";
import { sendTypingHandler, stopTypingHandler } from "../handlers/typing.handler.js";

export const handlers = {
    send_message: sendMessage,
    start_typing: sendTypingHandler,
    stop_typing: stopTypingHandler,
    send_read_receipt: readReceiptsHandler,
} as const;