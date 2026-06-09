import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import express from "express";
import { router1 } from "./routes/auth.routes.js";
import { router2 } from "./routes/conversation.router.js";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", router1);
app.use("/api/v1", router2);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

export default app;