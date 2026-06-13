import { parse } from "cookie";
import jwt from "jsonwebtoken";
import type { IncomingMessage } from "http";
import { env } from "../../lib/env.js";

export const extractUserId = (request: IncomingMessage): string | null => {
    // console.log("7");
    const cookies = parse(request.headers.cookie || "");
    const token = cookies.token;
    if (!token) return null;
    // console.log("11");
    const payload = jwt.verify(token, env.TOKEN_SECRET);
    if (typeof payload == "string") return null;
    return payload.id;
} 