import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authstore";
import { Loader2 } from 'lucide-react';

export const ForwardRoutes = ({children}) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const isLoading = useAuthStore((state) => state.isLoading);
    const isVerfied = useAuthStore((state) => state.user?.verified);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isLoggedIn && isVerfied ) {
            navigate("/");
        }
    }, [isLoading, isLoggedIn, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Loader2 className="w-8 h-8 text-gray-600 animate-pulse" />
                    </div>
                </div>
                <p className="ml-4 text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                    Loading...
                </p>
            </div>
        );
    }

    return !isLoggedIn ? children : null;
};