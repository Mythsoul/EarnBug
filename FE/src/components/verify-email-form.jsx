import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authstore";

export default function VerifyEmailForm({ onVerified, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();


  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      code: "",
    },
  });
  axios.defaults.withCredentials = true;

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_BE_URL + "/api/auth/verify-email", {
        code: data.code,
        credentials: true,
        withCredentials: true
      });

      if(response.data.success) {
       
        setUser({ ...user, verified: true });
        toast.success(response.data.message);
        onVerified?.(); 
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  const resendVerificationEmail = async () => {
    try {
      setIsSending(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BE_URL}/api/auth/resendVerificationEmail`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success("Verification code sent to your email");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast.error(error.response?.data?.message || "Failed to resend verification code");
    } finally {
      setIsLoading(false);
    }
};

  
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal content */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="mx-auto rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-lg border border-gray-200 dark:border-zinc-800">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            ×
          </button>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Please enter the 6-digit code sent to your email</p>

          <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="code" className="text-gray-900 dark:text-white">Verification Code</Label>
              <Input
                id="code"
                placeholder="123456"
                type="text"
                className="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                {...register("code", {
                  required: "Verification code is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Code must be a 6-digit number",
                  },
                })}
              />
              {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>}
            </div>
            <button
              type="button"
              onClick={resendVerificationEmail}
              className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
              disabled={isLoading || isSending}
            >
              {isSending ? "Sending..." : "Click here to Send Verification Code Again"}
            </button>

            <button
              className="mt-6 w-full h-10 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
