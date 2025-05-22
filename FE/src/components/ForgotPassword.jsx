"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { X, Mail, ArrowLeft, CheckCircle, Eye, EyeOff, Lock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ForgotPasswordForm({ onClose }) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState("email") // email, reset, success
  const [email, setEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  // Form for email step
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm({
    defaultValues: {
      email: "",
    },
  })

  // Form for reset code and new password step
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset },
    watch: watchReset,
  } = useForm({
    defaultValues: {
      resetCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Handle email submission
  const onSubmitEmail = async (data) => {
    setIsLoading(true)
    try {
    
      const response = await axios.post(`${import.meta.env.VITE_BE_URL}/api/auth/sendResetPasswordEmail`, {
        email: data.email,
      })

      if (response.data.success) {
        setEmail(data.email)
        setCurrentStep("reset")
        toast.success("Reset code sent! Please check your email")
      } else {
        toast.error(response.data.message || "Failed to send reset code")
      }
    } catch (error) {
      console.error("Password reset request failed:", error)
      toast.error(error.response?.data?.message || "Failed to send reset code")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle reset code and new password submission
  const onSubmitReset = async (data) => {
    setIsLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BE_URL}/api/auth/resetPassword`, {
        email: email,
        code: data.resetCode,
        newPassword: data.newPassword,
      })

      if (response.data.success) {
        setCurrentStep("success")
        toast.success("Password reset successfully!")
      } else {
        toast.error(response.data.message || "Failed to reset password")
      }
    } catch (error) {
      console.error("Password reset failed:", error)
      toast.error(error.response?.data?.message || "Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      navigate("/login")
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-lg border border-gray-200 dark:border-zinc-800 relative">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <AnimatePresence mode="wait">
        {currentStep === "email" && (
          <motion.div
            key="email-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                <Mail className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                No worries! Enter your email and we'll send you a reset code
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmitEmail(onSubmitEmail)}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 dark:text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  className="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  {...registerEmail("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errorsEmail.email && <p className="text-sm text-red-500 mt-1">{errorsEmail.email.message}</p>}
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium inline-flex items-center"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to login
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {currentStep === "reset" && (
          <motion.div
            key="reset-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                <Lock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reset Your Password</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-purple-600 dark:text-purple-400">
                  {email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
                </span>{" "}
                and your new password
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmitReset(onSubmitReset)}>
              <div className="space-y-2">
                <Label htmlFor="resetCode" className="text-gray-900 dark:text-white">
                  Reset Code
                </Label>
                <Input
                  id="resetCode"
                  placeholder="123456"
                  type="text"
                  className="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-center text-lg tracking-widest"
                  {...registerReset("resetCode", {
                    required: "Reset code is required",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "Code must be a 6-digit number",
                    },
                  })}
                />
                {errorsReset.resetCode && <p className="text-sm text-red-500 mt-1">{errorsReset.resetCode.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-900 dark:text-white">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    className="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white pr-10"
                    {...registerReset("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/,
                        message:
                          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errorsReset.newPassword && (
                  <p className="text-sm text-red-500 mt-1">{errorsReset.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-900 dark:text-white">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  className="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  {...registerReset("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === watchReset("newPassword") || "Passwords do not match",
                  })}
                />
                {errorsReset.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{errorsReset.confirmPassword.message}</p>
                )}
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep("email")}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium inline-flex items-center"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to email
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {currentStep === "success" && (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-6"
          >
            <div className="mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
              >
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </motion.div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Password Reset Successfully!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xs mx-auto">
              Your password has been reset successfully. You can now log in with your new password.
            </p>

            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={handleClose}
            >
              Back to Login
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
        <CuteCharacter currentStep={currentStep} />
      </div>
    </div>
  )
}

const CuteCharacter = ({ currentStep }) => (
  <div className="relative">
    <motion.svg
      width="80"
      height="80"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={
        currentStep === "success"
          ? {
              y: [0, -10, 0],
              rotate: [0, -5, 0, 5, 0],
            }
          : currentStep === "reset"
            ? {
                y: [0, -7, 0],
                rotate: [0, -3, 0, 3, 0],
              }
            : {
                y: [0, -5, 0],
              }
      }
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: currentStep === "success" ? 1.5 : 2,
        ease: "easeInOut",
      }}
    >
      {/* Body */}
      <circle cx="100" cy="130" r="50" className="fill-purple-200 dark:fill-purple-900" />

      {/* Face */}
      <circle cx="100" cy="90" r="40" className="fill-purple-200 dark:fill-purple-900" />

      {/* Eyes */}
      <circle cx="85" cy="85" r="8" className="fill-white" />
      <circle cx="115" cy="85" r="8" className="fill-white" />

      {/* Pupils */}
      <motion.g
        animate={{
          x: currentStep === "success" ? [0, 2, 0, -2, 0] : currentStep === "reset" ? [0, 1, 0, -1, 0] : [0, 0],
          y: currentStep === "reset" ? [-1, 0, -1] : [0, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <circle cx="85" cy="85" r="4" className="fill-purple-900 dark:fill-purple-300" />
        <circle cx="115" cy="85" r="4" className="fill-purple-900 dark:fill-purple-300" />
      </motion.g>

      {/* Blush */}
      <circle cx="75" cy="100" r="7" className="fill-pink-300 dark:fill-pink-800" opacity="0.6" />
      <circle cx="125" cy="100" r="7" className="fill-pink-300 dark:fill-pink-800" opacity="0.6" />

      {/* Mouth */}
      <motion.path
        d={
          currentStep === "success"
            ? "M85,105 Q100,115 115,105"
            : currentStep === "reset"
              ? "M85,105 Q100,112 115,105"
              : "M85,105 Q100,110 115,105"
        }
        className="stroke-purple-900 dark:stroke-purple-300"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        animate={{
          d:
            currentStep === "success"
              ? ["M85,105 Q100,115 115,105", "M85,105 Q100,120 115,105", "M85,105 Q100,115 115,105"]
              : currentStep === "reset"
                ? ["M85,105 Q100,112 115,105", "M85,105 Q100,114 115,105", "M85,105 Q100,112 115,105"]
                : ["M85,105 Q100,110 115,105", "M85,105 Q100,112 115,105", "M85,105 Q100,110 115,105"],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
          ease: "easeInOut",
        }}
      />

      {/* Ears */}
      <circle cx="70" cy="60" r="15" className="fill-purple-200 dark:fill-purple-900" />
      <circle cx="130" cy="60" r="15" className="fill-purple-200 dark:fill-purple-900" />

      {/* Inner ears */}
      <circle cx="70" cy="60" r="8" className="fill-pink-200 dark:fill-pink-900" />
      <circle cx="130" cy="60" r="8" className="fill-pink-200 dark:fill-pink-900" />

      {/* Props based on step */}
      {currentStep === "email" && (
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
        >
          <rect
            x="70"
            y="30"
            width="60"
            height="10"
            rx="5"
            className="fill-gray-300 dark:fill-gray-700"
            transform="rotate(-5 100 35)"
          />
        </motion.g>
      )}

      {currentStep === "reset" && (
        <motion.g
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
          style={{ originX: "100px", originY: "40px" }}
        >
          <rect x="85" y="30" width="30" height="20" rx="2" className="fill-gray-300 dark:fill-gray-700" />
          <circle cx="100" cy="40" r="5" className="fill-gray-400 dark:fill-gray-600" />
          <rect x="97" y="40" width="6" height="10" className="fill-gray-500 dark:fill-gray-500" />
        </motion.g>
      )}

      {currentStep === "success" && (
        <motion.g
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: [-20, -30, -20], opacity: 1 }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
            delay: 0.3,
          }}
        >
          <circle cx="100" cy="40" r="15" className="fill-green-100 dark:fill-green-900" />
          <path
            d="M90,40 L97,47 L110,34"
            className="stroke-green-600 dark:stroke-green-400"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.g>
      )}
    </motion.svg>
  </div>
)
