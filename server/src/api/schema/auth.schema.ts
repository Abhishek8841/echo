import { z } from "zod";

export const signUpSchema = z.object({
    email: z
        .email()
        .trim(),

    password: z
        .string()
        .min(8)
        .max(100),
});

export const signInSchema = z.object({
    email: z
        .email()
        .trim(),

    password: z
        .string()
        .min(8)
        .max(100),
})


export type signUpType = z.infer<typeof signUpSchema>;
export type signInType = z.infer<typeof signInSchema>;