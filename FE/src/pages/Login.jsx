import LoginForm from "@/components/login-form"
import { motion } from "framer-motion"

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-transparent bg-clip-text">
              EarnBug
            </span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>
        </div>
        <LoginForm />
      </motion.div>
    </div>
  )
}
