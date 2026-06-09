import express from "express";
import { logoutController, meController, signInController, signUpController } from "../controller/auth.controller.js";

export const router1 = express.Router();

router1.post("/signup",signUpController);
router1.post("/signin",signInController);
router1.get("/me",meController);
router1.post("/logout",logoutController);
