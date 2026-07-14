import axios from "axios";
import type { SignInBody, SignUpBody } from "../types/auth.types";

export const api = axios.create(
    {
        baseURL: import.meta.env.VITE_API_URL,
        withCredentials: true,
    }
);

export async function signIn({ email, password }: SignInBody) {
    const response = await api.post('/signin', {
        email, password
    })
    return response.data;
}

export async function signUp({ email, password }: SignUpBody) {
    const response = await api.post("/signup", {
        email, password,
    });
    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get("/me");
    return response.data.user;
}

export async function logout() {
    const response = await api.post("/logout");
    return response.data;
}

export async function getUsers() {
    const response = await api.get("/users");
    return response.data.users;
}

export async function getMessages(userId: string, signal?: AbortSignal) {
    const response = await api.get(`/messages/${userId}`, { signal });
    return response.data.messages;
}

export async function getUnreadList() {
    console.log("inside api.ts");
    const response = await api.get("/messages/unreadCount");
    return response.data.unread;
}