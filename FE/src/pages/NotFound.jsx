import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(15)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1)
      } else {
        navigate("/")
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50 p-4">
      <div className="max-w-md w-full mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Oopsie Woopsie!</h2>
          <p className="text-gray-600 mb-6">
            The page you're looking for seems to have wandered off for a little adventure.
          </p>
        </motion.div>

        <div className="relative mb-12">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            className="w-64 h-64 mx-auto"
          >
            <CuteCat />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-6 right-10 transform rotate-12 bg-white rounded-xl p-3 shadow-md"
          >
            <p className="text-sm font-medium text-gray-700">Where am I?</p>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg flex items-center justify-center gap-2 w-full md:w-auto"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Home size={18} />
              Take Me Home
            </motion.button>
          </Link>
 
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            
            className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-full font-medium shadow-sm flex items-center justify-center gap-2 w-full md:w-auto"
          >
            <ArrowLeft size={18} />
            Go Back
          </motion.button>
       
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-gray-500"
        >
          <p>
            Redirecting to home in <span className="font-medium text-purple-500">{countdown}</span> seconds
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: `${countdown * 10}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const CuteCat = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Body */}
    <ellipse cx="100" cy="110" rx="60" ry="50" fill="#f9c9df" />

    {/* Head */}
    <circle cx="100" cy="70" r="40" fill="#f9c9df" />

    {/* Ears */}
    <polygon points="70,45 60,10 85,35" fill="#f9c9df" />
    <polygon points="130,45 140,10 115,35" fill="#f9c9df" />
    <polygon points="72,45 62,15 87,35" fill="#ffb6e1" />
    <polygon points="128,45 138,15 113,35" fill="#ffb6e1" />

    {/* Eyes */}
    <g className="eyes">
      <circle cx="80" cy="65" r="10" fill="white" />
      <circle cx="120" cy="65" r="10" fill="white" />
      <circle cx="83" cy="65" r="5" fill="#333" className="pupils" />
      <circle cx="123" cy="65" r="5" fill="#333" className="pupils" />
      <circle cx="81" cy="62" r="2" fill="white" />
      <circle cx="121" cy="62" r="2" fill="white" />
    </g>

    {/* Nose */}
    <path d="M100,75 Q96,80 100,85 Q104,80 100,75" fill="#ffb6e1" />

    {/* Mouth */}
    <path d="M90,90 Q100,100 110,90" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />

    {/* Whiskers */}
    <line x1="60" y1="80" x2="85" y2="78" stroke="#333" strokeWidth="1.5" />
    <line x1="60" y1="85" x2="85" y2="85" stroke="#333" strokeWidth="1.5" />
    <line x1="60" y1="90" x2="85" y2="92" stroke="#333" strokeWidth="1.5" />

    <line x1="140" y1="80" x2="115" y2="78" stroke="#333" strokeWidth="1.5" />
    <line x1="140" y1="85" x2="115" y2="85" stroke="#333" strokeWidth="1.5" />
    <line x1="140" y1="90" x2="115" y2="92" stroke="#333" strokeWidth="1.5" />

    {/* Paws */}
    <ellipse cx="70" cy="150" rx="15" ry="10" fill="#ffb6e1" />
    <ellipse cx="130" cy="150" rx="15" ry="10" fill="#ffb6e1" />

    {/* Tail */}
    <path d="M160,110 Q180,90 190,110 Q180,130 160,110" fill="#f9c9df" />
  </svg>
)
