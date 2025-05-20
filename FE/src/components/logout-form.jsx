import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
export default function LogoutForm() { 
    const navigate = useNavigate(); 
    const [isLoading, setIsLoading] = useState(false);   

    axios.defaults.withCredentials = true;
    const handleLogout = async () => { 
        setIsLoading(true); 
        try { 
            const response = await axios.post(import.meta.env.VITE_BE_URL + "/api/auth/logout", { 
                withCredentials: true
            }); 
            console.log("Logout response:", response.data);
            if (response.data.success) {
                toast.success("Successfully logged out");  
                navigate("/"); 
            } else {
                toast.error("Logout failed: " + response.data.message);  
            }
        } catch (error) { 
            console.error("Logout failed:", error);
            toast.error("Logout failed: " + error.message);
        } finally { 
            setIsLoading(false); 
        }
    }; 

    return ( 
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4"> 
            <button onClick={handleLogout} disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded">
                {isLoading ? "Logging out..." : "Logout"}
            </button>
        </div>
    );
} 