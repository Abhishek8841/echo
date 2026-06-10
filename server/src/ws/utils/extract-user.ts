import { parse } from "cookie";
import jwt from "jsonwebtoken";
import type { IncomingMessage } from "http";
import { env } from "../../lib/env.js";

export const extractUserId = (request: IncomingMessage): string | null => {
    const cookies = parse(request.headers.cookie || "");
    const token = cookies.token;
    if (!token) return null;
    const payload = jwt.verify(token, env.TOKEN_SECRET);
    if (typeof payload == "string") return null;
    return payload.id;
}