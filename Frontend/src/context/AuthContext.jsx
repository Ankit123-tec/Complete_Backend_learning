import { createContext, useContext, useEffect, useState } from "react";
import { userApi } from "../api/axios";
import React from "react";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function currentUser() {

        try {

            const response = await userApi.get(
                "/get-current-user-data"
            );

            setUser(response.data?.data || null);

        } catch (error) {

            setUser(null);

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {
        currentUser();
    }, []);

    async function login(data) {

        const response = await userApi.post(
            "/login",
            data
        );

        setUser(response.data?.data?.user || null);

        return response.data;
    }

    async function register(data) {

        const response = await userApi.post(
            "/register",
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return response.data;
    }

    async function logout() {

        await userApi.post("/logout");

        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                login,
                register,
                logout,
                currentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}