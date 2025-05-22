import { useEffect } from "react";
import useAuthStore from "@/store/authstore";
import { Loader2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "./Loader";

export const ProtectedRoute = ({children}) => {
    const { isLoggedIn, isLoading, user, setShowVerifyModal } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (!isLoggedIn) {
                navigate("/login");
            } else if ( !user?.verified) {
                toast.error("Please verify your email to use the services", {
                    duration: 4000,
                });
                setShowVerifyModal(true);
                navigate("/");
            }
        }
    }, [isLoading, isLoggedIn, user?.verified, navigate, setShowVerifyModal]);

    // Show loading spinner
    if (isLoading) {
        return (
           <Loader />
        );
    }

    // Only render children if user is logged in and verified
    return isLoggedIn && user?.verified ? children : null;
};