import { type Request, type Response } from "express"
import { MessageListService, userListService } from "../services/conversation.services.js";
import { userIdSchema } from "../schema/conversation.schema.js";

export const getMessageList = async (req: Request, res: Response) => {
    try {
        const result = userIdSchema.safeParse(req.params);
        if (!result.success) return res.json({
            success: false,
            message: "Invalid user params",
        })
        const data = result.data.id;
        const id = req.id;
        if (!id) throw new Error("User doesn't exist");
        const messages = await MessageListService(data, id);
        return res.json({
            success: true,
            message: "Messages fetched successfully",
            messages
        })
    } catch (e) {
        return res.json(
            {
                success: false,
                message: e instanceof Error ? e.message : "Internal server error",
            }
        )
    }
}

export const getUserList = async (req: Request, res: Response) => {
    try {
        const id = req.id;
        if (!id) throw new Error("User doesn't exist");
        const { users } = await userListService(id);
        return res.json({
            success: true,
            message: "Successfully fetched the users list",
            users
        })
    } catch (e) {
        return res.json(
            {
                success: false,
                message: e instanceof Error ? e.message : "Internal server error",
            }
        )
    }
}