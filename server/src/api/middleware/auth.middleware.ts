import type { NextFunction, Request, Response } from "express";
import { jwtAuthService } from "../services/auth.services.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Unauthorized");
        }
        const id = await jwtAuthService(token);
        req.id = id;
        next();

    } catch (e) {
        res.json({
            success: false,
            message: e instanceof Error ? e.message : "Internal server error",
        })
    }
}