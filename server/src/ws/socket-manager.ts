import WebSocket from "ws"
import { serverMessageSchema, type ServerMessageType } from "./schemas/server-message.schema.js";


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

export const broadCast = (msg: ServerMessageType) => {
    let parsed = serverMessageSchema.safeParse(msg);
    if (!parsed.success) return;
    msg = parsed.data;
    for (const sockets of list.values()) {
        for (const socket of sockets) {
            socket.send(JSON.stringify(msg));
        }
    }
}

export const broadCastToEveryOneExcept = (id: string, msg: ServerMessageType) => {
    let parsed = serverMessageSchema.safeParse(msg);
    if (!parsed.success) return;
    msg = parsed.data;
    for (const [userId, sockets] of list) {
        if (userId === id) continue;
        for (const socket of sockets) {
            socket.send(JSON.stringify(msg));
        }
    }
}

export const sendToUser = (id: string, msg: ServerMessageType) => {
    if (!list.has(id)) return;
    let parsed = serverMessageSchema.safeParse(msg);
    if (!parsed.success) return;
    msg = parsed.data;
    const sockets = list.get(id);
    for (const socket of sockets ?? []) {
        socket.send(JSON.stringify(msg));
    }
}

export const onlineUsersList = () => {
    return [...list.keys()];
}

export const isUserOnline = (id: string) => {
    return list.has(id);
}