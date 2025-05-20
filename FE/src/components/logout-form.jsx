import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../store/authstore";
export default function LogoutForm() { 
    const navigate = useNavigate(); 
    const [isLoading, setIsLoading] = useState(false);   
    const { resetAuth } = useAuthStore();

    const handleLogout = async () => { 
        setIsLoading(true); 
        try { 
            const response = await axios.post(
                `${import.meta.env.VITE_BE_URL}/api/auth/logout`, 
                {}, 
                { withCredentials: true }
            ); 

            if (response.data.success) {
                resetAuth();
                toast.success("Successfully logged out");  
                navigate("/login"); 
            }
        } catch (error) { 
            toast.error(error.response?.data?.message || "Logout failed");
        } finally { 
            setIsLoading(false); 
        }
    }; 

    if (isLoading) return <LoadingSpinner />;

    return ( 
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4"> 
            <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-zinc-900 p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Ready to leave?</h2>
                <p className="text-neutral-400 mb-8">You can always log back in anytime</p>
                
                <div className="flex gap-4 justify-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="group/btn relative px-6 py-2 rounded-md bg-zinc-800 text-neutral-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="group/btn relative px-6 py-2 rounded-md bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Logging out..." : "Logout"}
                        <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
                    </button>
                </div>
            </div>
        </div>
    );
}