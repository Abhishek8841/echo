
import cookieParser from "cookie-parser";
import express from "express";
import { router1 } from "./routes/auth.routes.js";
import { router2 } from "./routes/conversation.js";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use((_, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use("/api/v1", router1);
app.use("/api/v1", router2);

export default app;