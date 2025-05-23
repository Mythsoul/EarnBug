"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import useAuthStore from "../store/authstore"
import CuteLoader from "./Loader"
import { Eye, EyeOff, Github, Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import VerifyEmailForm from "./verify-email-form"
import ForgotPasswordForm from "./ForgotPassword"

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  axios.defaults.withCredentials = true
  const navigate = useNavigate()
  const { setUser, isLoggedIn, user, isLoading: authLoading } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Check if user is already logged in but not verified
  useEffect(() => {
    if (isLoggedIn && user && !user.verified) {
      setShowVerification(true)
      toast.error("Please verify your email to use the services", {
        duration: 4000,
      })
    }
  }, [])

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await axios.post(import.meta.env.VITE_BE_URL + "/api/auth/login", {
        email: data.email,
        password: data.password,
        credentials: true,
        withCredentials: true,
      })

      if (response.data.success) {
        setUser(response.data.user)
        if (!response.data.user.verified) {
          toast.error(
            "Please verify your email to use the services, the verification code has been sent to your email",
            {
              duration: 4000,
            },
          )
          setShowVerification(true)
          return
        } else {
          toast.success("Successfully logged in")
          navigate("/")
        }
      } else {
        toast.error("Login failed: Invalid credentials")
      }
    } catch (error) {
      console.error("Login failed:", error)
      toast.error(error.response?.data?.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGitHubAuth = () => {
    window.location.href = `${import.meta.env.VITE_BE_URL}/api/auth/github`
  }

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_BE_URL}/api/auth/google`
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <CuteLoader variant="bunny" size="lg" text="Loading..." />
      </div>
    )
  }

  if (showVerification) {
    return (
      <VerifyEmailForm
        onVerified={() => {
          setShowVerification(false)
          toast.success("Email verified successfully")
          navigate("/")
        }}
        onCancel={() => {
          toast.error("Verification failed")
          navigate("/")
          setShowVerification(false)
        }}
      />
    )
  }

  if (showForgotPassword) {
    return <ForgotPasswordForm onClose={() => setShowForgotPassword(false)} />
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-purple-100 dark:border-purple-900/50 shadow-xl">
      <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      <CardHeader className="space-y-1 pt-6">
        <div className="flex justify-center mb-2">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md shadow-purple-500/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Logging in...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>Sign in</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 flex items-center">
          <div className="flex-grow h-px bg-gray-200 dark:bg-gray-800"></div>
          <span className="mx-4 text-xs text-gray-500 dark:text-gray-400">OR CONTINUE WITH</span>
          <div className="flex-grow h-px bg-gray-200 dark:bg-gray-800"></div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleGitHubAuth}
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button
            variant="outline"
            className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            <GoogleIcon className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

const GoogleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" {...props}>
    <path
      fill="currentColor"
      d="M12 22q-2.05 0-3.875-.788t-3.188-2.15-2.137-3.175T2 12q0-2.075.788-3.887t2.15-3.175 3.175-2.138T12 2q2.075 0 3.887.788t3.175 2.15 2.138 3.175T22 12q0 2.05-.788 3.875t-2.15 3.188-3.175 2.137T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z"
    />
  </svg>
)
