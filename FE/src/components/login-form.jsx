import { useState, useEffect } from "react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { cn } from "../lib/utils"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import useAuthStore from "../store/authstore"
import VerifyEmailForm from "./verify-email-form"
import Loader from "./Loader"

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  axios.defaults.withCredentials = true
  const navigate = useNavigate()
  const { setUser, isLoggedIn, user , isLoading: authLoading } = useAuthStore()

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
  }, [ ])

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
          toast.error("Please verify your email to use the services , the verification code has been sent to your email", {
            duration: 4000,
          })
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
    window.location.href = `${import.meta.env.VITE_BE_URL}/api/auth/github`;
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_BE_URL}/api/auth/google`;
  };
  if(authLoading) {
    return <Loader />
  }
  if (showVerification) {
    console.log("Rendering verification form")
    return (
      <VerifyEmailForm
        onVerified={() => {
          setShowVerification(false)
          toast.success("Email verified successfully")
          navigate("/")
        }}
        onCancel={() => {
          setShowVerification(false)
        }}
      />
    )
  }

  
  return (
    <div className="shadow-lg mx-auto w-full max-w-md rounded-lg bg-white dark:bg-zinc-900 p-6 border border-gray-200 dark:border-zinc-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Welcome back to Earn Bug</h2>
      <p className="mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
        Login to your account to continue your journey
      </p>

      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email" className="text-gray-900 dark:text-white">
            Email Address
          </Label>
          <Input
            id="email"
            placeholder="you@example.com"
            type="email"
            className="border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </LabelInputContainer>

        <LabelInputContainer className="mb-6">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-gray-900 dark:text-white">
              Password
            </Label>
            <Link to="/forgot-password" className="text-xs text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            className="border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
            {...register("password", {
              required: "Password is required",
              validate: (value) => {
                if (value.length < 8) {
                  return "Password must be at least 8 characters"
                }
                return true
              },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </LabelInputContainer>

        <button
          className="group relative block h-10 w-full rounded-md bg-blue-600 font-medium text-white hover:bg-blue-700 disabled:opacity-70 transition-colors"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log in →"}
          <BottomGradient />
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-grow h-[1px] bg-gray-300 dark:bg-zinc-700"></div>
          <span className="mx-4 text-xs text-gray-500 dark:text-gray-400">OR</span>
          <div className="flex-grow h-[1px] bg-gray-300 dark:bg-zinc-700"></div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            className="group relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            type="button"
            onClick={handleGitHubAuth}
          >
            <GitHubIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Continue with GitHub</span>
            <BottomGradient />
          </button>
          <button
            className="group relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            type="button"
            onClick={handleGoogleAuth}
          >
            <GoogleIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Continue with Google</span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover:opacity-100" />
    </>
  )
}

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
}

const GitHubIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const GoogleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12 L16 12" />
    <path d="M12 8 L12 16" />
  </svg>
)