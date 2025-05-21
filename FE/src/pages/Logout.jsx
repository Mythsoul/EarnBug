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

    return ( 
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4"> 
            <div className="shadow-lg mx-auto w-full max-w-md rounded-lg bg-white dark:bg-zinc-900 p-8 text-center border border-gray-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to leave?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">You can always log back in anytime</p>
                
                <div className="flex gap-4 justify-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="px-6 py-2 rounded-md bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="group relative px-6 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging out...
                            </div>
                        ) : "Logout"}
                        <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                    </button>
                </div>
            </div>
        </div>
    );
}
