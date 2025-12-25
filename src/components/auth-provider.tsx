"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for active session
        async function getSession() {
            setLoading(true);
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Auth Error:", error);
            }
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        }

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Helper to set loading to false slightly delayed to prevent hydration mismatch flashes?
    // Not needed if we use suppressHydrationWarning.
    // But we need to avoid "isLoading" jumping.

    const setLoading = (loading: boolean) => setIsLoading(loading);

    return (
        <AuthContext.Provider value={{ user, session, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
