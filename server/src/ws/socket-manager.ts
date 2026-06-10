import WebSocket from "ws"
import type { clientMessageType } from "./schemas/client-message.schema.js";


const list = new Map<string, Set<WebSocket>>()

export const addUser = (userId: string, socket: WebSocket): void => {
    if (!list.has(userId)) list.set(userId, new Set());
    list.get(userId)?.add(socket);
}
export const removeUserSocket = (userId: string, socket: WebSocket): void => {
    if (!list.has(userId)) return;
    list.get(userId)?.delete(socket);
    if (list.get(userId)?.size == 0) list.delete(userId);
}

export const getUserSockets = (userId: string): Set<WebSocket> | undefined => {
    return list.get(userId);
}

