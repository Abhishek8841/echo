import express from "express";
import { getMessageList, getUserList } from "../controller/conversation.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const router2 = express.Router();

router2.get("/users", authMiddleware, getUserList);
router2.get("/messages/:id", authMiddleware, getMessageList); 