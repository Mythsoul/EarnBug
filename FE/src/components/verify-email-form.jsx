import { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function VerifyEmailForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      code: "",
    },
  });
axios.defaults.withCredentials = true; 
const navigate = useNavigate(); 
  const onSubmit = async (data) => {
    setIsLoading(true);
    try { 
        const email = localStorage.getItem('userEmail'); // Add this to store email during registration
        const response = await axios.post(import.meta.env.VITE_BE_URL + "/api/auth/verify-email", { 
            code: data.code,
            email: email,
            credentials: true,
            withCredentials: true 
        });

        if(response.data.success) { 
            toast.success(response.data.message);
            navigate("/");
        } else { 
            toast.error(response.data.message);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Verification failed");
        console.error("Verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-lg bg-white p-6">
      <h2 className="text-xl font-bold text-black">Verify Your Email</h2>
      <p className="mt-2 text-sm text-gray-600">Please enter the 6-digit code sent to your email</p>

      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="code">Verification Code</Label>
        <Input
          id="code"
          placeholder="123456"
          type="text"
          {...register("code", {
            required: "Verification code is required",
            pattern: {
              value: /^\d{6}$/,
              message: "Code must be a 6-digit number",
            },
          })}
        />
        {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>}

        <button
          className="mt-4 w-full h-10 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-70"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}

