import WebSocket, { WebSocketServer } from "ws"
import { extractUserId } from "./utils/extract-user.js";
import { addUser, removeUserSocket } from "./socket-manager.js";
import { clientMessageSchema } from "./schemas/client-message.schema.js";
import { handlers } from "./routes/message.routes.js";
import type { IncomingMessage, Server } from "http";

export const initWebsockets = (server: Server) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
        const id = extractUserId(req);
        if (!id) {
            ws.close();
            return;
        };

        addUser(id, ws);

        ws.on("message", async (msg) => {
            try {
                const result = clientMessageSchema.safeParse(JSON.parse(msg.toString()));
                if (!result.success) return;
                const data = result.data;
                const handler = handlers[data.type];
                if (handler)
                    await handler(id, data);
            } catch (e) {
                console.error(e);
            }
        })

        ws.on("close", () => {
            removeUserSocket(id, ws);
        })

    })
}