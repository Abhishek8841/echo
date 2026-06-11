import { type Request, type Response } from "express";
import { signInSchema, signUpSchema } from "../schema/auth.schema.js";
import { meService, signInService, signUpService } from "../services/auth.services.js";

export const signUpController = async (req: Request, res: Response) => {
    try {
        const result = signUpSchema.safeParse(req.body);
        if (!result.success) return res.status(400).json(
            {
                success: false,
                message: "Invalid input"
            }
        )
        const data = result.data;
        const { token, newUser } = await signUpService(data);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        })
        return res.status(200).json(
            {
                success: true,
                message: "User created successfully",
                user: newUser
            }
        )
    } catch (e: any) {
        return res.status(400).json(
            {
                success: false,
                message: e instanceof Error ? e.message : "Internal Server Error",
            }
        )
    }
}


export const signInController = async (req: Request, res: Response) => {
    try {
        const result = signInSchema.safeParse(req.body);
        if (!result.success) return res.status(400).json(
            {
                success: false,
                message: "Invalid input"
            }
        )
        const data = result.data;
        const { token, user } = await signInService(data);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        })
        return res.status(200).json(
            {
                success: true,
                message: "User loggedin successfully",
                user
            }
        )
    } catch (e: any) {
        return res.status(400).json(
            {
                success: false,
                message: e instanceof Error ? e.message : "Internal Server Error",
            }
        )
    }
}

export const meController = async (req: Request, res: Response) => {
    try {
        const id = req.id;
        if (!id) throw new Error("User doesn't exist");
        const { user } = await meService(id);
        return res.json({
            success: true,
            message: "User fetched successfully",
            user
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e instanceof Error ? e.message : "Internal server Error"
        })
    }
}

export const logoutController = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });
    return res.json({
        success: true,
        message: "Logged out successfully"
    })
}
