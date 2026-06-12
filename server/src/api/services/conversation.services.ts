import { prisma } from "../../lib/prisma.js"

export const userListService = async (id: string) => {
    const users = await prisma.user.findMany({
        where: {
            id: {
                not: id
            }
        },
        select: {
            id: true,
            email: true,
        }
    })
    return { users };
}

export const MessageListService = async (id1: string, id2: string) => {
    const messages = await prisma.message.findMany({
        where: {
            OR: [
                {
                    senderId: id1,
                    receiverId: id2,
                },
                {
                    senderId: id2,
                    receiverId: id1
                }
            ]
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            receiverId: true,
        },
        orderBy: {
            createdAt: "asc",
        }
    });
    return messages;
}