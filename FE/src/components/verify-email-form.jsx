"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../store/authstore"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { motion } from "framer-motion"

export default function VerifyEmailForm({ onVerified, onCancel }) {
  const [isLoading, setIsLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const navigate = useNavigate()
  const { user, setUser, setShowVerifyModal } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await axios.post(import.meta.env.VITE_BE_URL + "/api/auth/verify-email", {
        code: data.code,
        credentials: true,
        withCredentials: true,
      })

      if (response.data.success) {
        // Update user verification status
        setUser({ ...user, verified: true })
        toast.success(response.data.message || "Email verified successfully")
        setShowVerifyModal(false)
        onVerified?.()
        navigate("/")
      } else {
        toast.error(response.data.message || "Verification failed")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BE_URL}/api/auth/resendVerificationEmail`,
        {},
        { withCredentials: true },
      )

      if (response.data.success) {
        toast.success("Verification code resent successfully")
      } else {
        toast.error(response.data.message || "Failed to resend verification code")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend verification code")
    } finally {
      setResendLoading(false)
    }
  }

  const handleClose = () => {
    setShowVerifyModal(false)
    onCancel?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto w-full max-w-md rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-lg border border-gray-200 dark:border-zinc-800 relative"
    >
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-purple-600 dark:text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Verify Your Email</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We've sent a 6-digit verification code to{" "}
          <span className="font-medium text-purple-600 dark:text-purple-400">
            {user?.email ? user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3") : "your email"}
          </span>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="code" className="text-gray-900 dark:text-white">
            Verification Code
          </Label>
          <Input
            id="code"
            placeholder="123456"
            type="text"
            className="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-center text-lg tracking-widest"
            {...register("code", {
              required: "Verification code is required",
              pattern: {
                value: /^\d{6}$/,
                message: "Code must be a 6-digit number",
              },
            })}
            maxLength={6}
            minLength={6}
            autoComplete="off"
          />
          {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>}
        </div>

        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading}
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium disabled:opacity-50"
            >
              {resendLoading ? "Sending..." : "Resend"}
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  )
}
