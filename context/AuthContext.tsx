
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from '../types';

interface AuthState {
    token: string | null;
    user: User | null;
}

interface AuthContextType {
    auth: AuthState;
    login: (token: string, user: User) => void;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    auth: { token: null, user: null },
    login: () => {},
    logout: () => {},
    loading: true,
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<AuthState>({ token: null, user: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("setu_token");
            const storedUser = localStorage.getItem("setu_user");
            if (storedToken && storedUser) {
                setAuth({ token: storedToken, user: JSON.parse(storedUser) });
            }
        } catch (error) {
            console.error("Failed to parse auth data from localStorage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem("setu_token", token);
        localStorage.setItem("setu_user", JSON.stringify(user));
        setAuth({ token, user });
    };

    const logout = () => {
        localStorage.removeItem("setu_token");
        localStorage.removeItem("setu_user");
        setAuth({ token: null, user: null });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ auth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
