import express from "express";
import { getMessageList, getUnreadCount, getUserList } from "../controller/conversation.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const router2 = express.Router();

router2.get("/users", authMiddleware, getUserList);
// remember to keep static routes above dynamic !_!
router2.get("/messages/unreadCount", authMiddleware, getUnreadCount);
router2.get("/messages/:id", authMiddleware, getMessageList);