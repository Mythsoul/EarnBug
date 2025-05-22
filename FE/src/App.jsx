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
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ForwardRoutes } from "./components/ForwardRoutes";
import NotFound from "./pages/NotFound";

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
      console.log("User not logged in");
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
          
          {/* Forward Routes - Redirect if logged in */}
          <Route path="/login" element={
            <ForwardRoutes>
              <Login />
            </ForwardRoutes>
          } />
          <Route path="/signup" element={
            <ForwardRoutes>
              <Signup />
            </ForwardRoutes>
          } />

          {/* Protected Routes - Require authentication */}
          <Route path="/logout" element={
            <ProtectedRoute>
              <Logout />
            </ProtectedRoute>
          } />
          <Route path="/image-generation" element={
            <ProtectedRoute>
              <ImageGeneration />
            </ProtectedRoute>
          } />
          <Route path="/text-to-voice" element={
            <ProtectedRoute>
              <TextToVoice />
            </ProtectedRoute>
          } />
          <Route path="/voice-to-text" element={
            <ProtectedRoute>
              <VoiceToText />
            </ProtectedRoute>
          } />
          <Route path="/chatbot" element={
            <ProtectedRoute>
              <ChatBot />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
          </main>
        </div>  
      </Router>
    </ThemeProvider>
    </>
  );
}

export default App;