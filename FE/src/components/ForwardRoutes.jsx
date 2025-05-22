import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authstore";
import { Loader2 } from 'lucide-react';
import Loader from "./Loader";

export const ForwardRoutes = ({children}) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const isLoading = useAuthStore((state) => state.isLoading);
    const isVerified = useAuthStore((state) => state.user?.verified);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isLoggedIn && isVerified) {
            navigate("/");
        }
    }, [isLoading, isLoggedIn, isVerified, navigate]);

    if (isLoading) {
        return (
          <Loader />
        );
    }

    return (!isLoggedIn  || !isVerified) ? children : null;
};