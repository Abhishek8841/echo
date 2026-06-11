import { env } from "../../lib/env.js";
import { prisma } from "../../lib/prisma.js";
import type { signInType, signUpType } from "../schema/auth.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUpService = async (signUpPayload: signUpType) => {
    const { email, password } = signUpPayload;
    if (!!await prisma.user.findFirst({
        where: {
            email
        }
    })) throw new Error("email already registered")
    let saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.user.create(
        {
            data: {
                email,
                password: hashedPassword,
            },
            select:
            {
                id: true,
                email: true,
            }
        }
    )
    const payload = { id: newUser.id }
    const token = jwt.sign(payload, env.TOKEN_SECRET);
    return { token, newUser };
}

export const signInService = async (signInPayload: signInType) => {
    const { email, password } = signInPayload;
    const user = await prisma.user.findFirst({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
            password: true,
        }
    })
    if (!user) throw new Error("User doesn't exist");
    if (!await bcrypt.compare(password, user.password)) {
        throw new Error("Wrong Credentials entered");
    }
    const payload = { id: user.id }
    const token = jwt.sign(payload, env.TOKEN_SECRET);
    const { password: _, ...safeUser } = user;
    return {
        token,
        user: safeUser
    };
}

export const meService = async (id: string) => {
    const user = await prisma.user.findFirst(
        {
            where: {
                id: id
            },
            select: {
                id: true,
                email: true,
            }
        }
    )
    if (!user) { console.log("71"); throw new Error("User doesn't exist") };
    return { user };
}

export const jwtAuthService = (token: string) => {
    const payload = jwt.verify(token, env.TOKEN_SECRET);
    if (typeof payload == "string" || !payload.id) { throw new Error("Invalid request"), console.log(77) };
    return payload.id;
}