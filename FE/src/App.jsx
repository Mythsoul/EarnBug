"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import axios from "axios"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Logout from "./pages/Logout"
import useAuthStore from "./store/authstore"
import ImageGeneration from "./pages/ImageGeneration"
import TextToVoice from "./pages/TextToVoice"
import VoiceToText from "./pages/VoiceToText"
import ChatBot from "./pages/ChatBot"
import HomePage from "./pages/HomePage"
import Navbar from "./components/Navbar"
import { ThemeProvider } from "./components/theme-provider"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { ForwardRoutes } from "./components/ForwardRoutes"
import NotFound from "./pages/NotFound"
import VerifyEmailForm from "./components/verify-email-form"
import ForgotPasswordForm from "./components/ForgotPassword"
import { PageContainer } from "./components/Layout"

function App() {
  const { setUser, setLoading, showVerifyModal } = useAuthStore()
  axios.defaults.withCredentials = true

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const response = await axios.post(`${import.meta.env.VITE_BE_URL}/api/auth/CheckAuthStatus`, {
          withCredentials: true,
          Credential: "include",
        })

        if (response.data.success) {
          setUser(response.data.user)
        }
      } catch (error) {
        console.log("User not logged in")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [setUser, setLoading])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="earnbug-theme">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--toast-bg, #333)",
            color: "var(--toast-color, #fff)",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
          },
          success: {
            style: {
              background: "var(--toast-success-bg, #10b981)",
              color: "var(--toast-success-color, #fff)",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10b981",
            },
          },
          error: {
            style: {
              background: "var(--toast-error-bg, #ef4444)",
              color: "var(--toast-error-color, #fff)",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#ef4444",
            },
          },
        }}
      />
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Forward Routes - Redirect if logged in */}
            <Route
              path="/login"
              element={
                <ForwardRoutes>
                  <Login />
                </ForwardRoutes>
              }
            />
            <Route
              path="/signup"
              element={
                <ForwardRoutes>
                  <Signup />
                </ForwardRoutes>
              }
            />

            {/* Protected Routes - Require authentication */}
            <Route
              path="/logout"
              element={
                <ProtectedRoute>
                  <Logout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/image-generation"
              element={
                <ProtectedRoute>
                  <ImageGeneration />
                </ProtectedRoute>
              }
            />

            <Route
              path="/text-to-voice"
              element={
                <ProtectedRoute>
                  <TextToVoice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/voice-to-text"
              element={
                <ProtectedRoute>
                  <VoiceToText />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <ChatBot />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={  <NotFound /> } />
          </Routes>

          {/* Modal for email verification */}
          {showVerifyModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-md w-full">
                <VerifyEmailForm />
              </div>
            </div>
          )}
        </div>
      </Router>
    </ThemeProvider>
  )
}


export default App

