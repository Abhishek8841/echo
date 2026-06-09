import express from "express";
import { getMessageList, getUserList } from "../controller/conversation.controller.js";

export const router2 = express.Router();

router2.get("/users", getMessageList);
router2.get("messages/:id", getUserList);