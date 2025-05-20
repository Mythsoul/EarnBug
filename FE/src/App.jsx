import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import axios from "axios";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import VerifyEmail from "./pages/Verify";
import useAuthStore from "./store/authstore";
import ImageGeneration from "@/pages/ImageGeneration"
import TextToVoice from "@/pages/TextToVoice"
import VoiceToText from "@/pages/VoiceToText"
import ChatBot from "@/pages/ChatBot"
import HomePage from "@/pages/HomePage"
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
function App() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BE_URL}/api/auth/check-session`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <>
    {/* <ThemeProvider defaultTheme="light"> */}
      <Toaster position="top-right" />
      <Router>
      <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/logout" element={<Logout />} />
                        <Route path="/image-generation" element={<ImageGeneration />} />
                        <Route path="/text-to-voice" element={<TextToVoice />} />
                        <Route path="/voice-to-text" element={<VoiceToText />} />
                        <Route path="/chatbot" element={<ChatBot />} />
        </Routes>
          </main>
        </div>  
      </Router>
    {/* </ThemeProvider> */}
    </>
  );
}

export default App;