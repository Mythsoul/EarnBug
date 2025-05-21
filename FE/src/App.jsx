import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import axios from "axios";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
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
axios.defaults.withCredentials = true;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BE_URL}/api/auth/CheckAuthStatus`,
          {
            withCredentials: true,
            Credential: "include",
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
    <ThemeProvider defaultTheme="dark">
      <Toaster position="top-right" />
      <Router>
      <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/image-generation" element={<ImageGeneration />} />
          <Route path="/text-to-voice" element={<TextToVoice />} />
          <Route path="/voice-to-text" element={<VoiceToText />} />
          <Route path="/chatbot" element={<ChatBot />} />
        </Routes>
          </main>
        </div>  
      </Router>
    </ThemeProvider>
    </>
  );
}

export default App;