import express from "express";
import { logoutController, meController, signInController, signUpController } from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const router1 = express.Router();

router1.post("/signup", signUpController);
router1.post("/signin", signInController);
router1.get("/me", authMiddleware, meController);
router1.post("/logout", logoutController);
