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
                console.log(msg.toString());
                const result = clientMessageSchema.safeParse(JSON.parse(msg.toString()));
                console.log("ws.ts");
                if (!result.success) return;
                console.log("ws.ts");
                const data = result.data;
                const handler = handlers[data.type];
                if (handler)
                    await handler(id, data);
                console.log("ws.ts");
            } catch (e) {
                console.log("ws.ts");
                console.error(e);
            }
        })

        ws.on("close", () => {
            removeUserSocket(id, ws);
        })

    })
}