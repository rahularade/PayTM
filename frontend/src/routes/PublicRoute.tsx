import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

export function PublicRoute({children} : {children: ReactNode}) {
    const {loading, user} = useAuth();
    if (loading) return null;
    return !user ? children : <Navigate to={"/dashboard"} replace/>
}