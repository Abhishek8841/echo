import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import express from "express";
import { router1 } from "./routes/auth.routes.js";
import { router2 } from "./routes/conversation.router.js";

const app = express();
import cors from "cors";

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
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