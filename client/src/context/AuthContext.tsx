import { createContext, useEffect, useState, type ReactNode } from "react";
import type { UserType } from "../types/auth.types";
import { getCurrentUser } from "../services/api";

type AuthContextType = {
    user: UserType | null,
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>,
    loading: boolean,
    fetchUser: () => Promise<void>
};

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(false);
    async function fetchUser() {
        try {
            setLoading(true);
            const FetchedUser = await getCurrentUser();
            setUser(FetchedUser);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchUser();
    }, [])

    const value = {
        user, setUser, loading, fetchUser
    }

    return (<AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>);
}