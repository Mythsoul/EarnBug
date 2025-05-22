"use client"

import { motion } from "framer-motion"
import { cn } from "../lib/utils"

export const loaderVariants = {
  bunny: "bunny",
  cat: "cat",
  duck: "duck",
  blob: "blob",
}

export default function CuteLoader({
  variant = "bunny",
  size = "md",
  text = "Loading...",
  showText = true,
  className,
}) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  }

  const renderLoader = () => {
    switch (variant) {
      case "bunny":
        return <BunnyLoader size={sizeClasses[size]} />
      case "cat":
        return <CatLoader size={sizeClasses[size]} />
      case "duck":
        return <DuckLoader size={sizeClasses[size]} />
      case "blob":
        return <BlobLoader size={sizeClasses[size]} />
      default:
        return <BunnyLoader size={sizeClasses[size]} />
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {renderLoader()}
      {showText && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={cn("mt-4 text-gray-600 dark:text-gray-400 font-medium", textSizeClasses[size])}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

const BunnyLoader = ({ size }) => (
  <div className={cn("relative", size)}>
    <motion.svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
    >
      {/* Body */}
      <motion.ellipse
        cx="100"
        cy="130"
        rx="40"
        ry="35"
        className="fill-pink-200 dark:fill-pink-900"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
      />

      {/* Head */}
      <circle cx="100" cy="90" r="35" className="fill-pink-200 dark:fill-pink-900" />

      {/* Ears */}
      <motion.g
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
        style={{ originX: "100px", originY: "70px" }}
      >
        <path
          d="M70,70 Q60,30 80,20"
          className="fill-none stroke-pink-200 dark:stroke-pink-900"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M130,70 Q140,30 120,20"
          className="fill-none stroke-pink-200 dark:stroke-pink-900"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M70,70 Q60,35 75,25"
          className="fill-none stroke-pink-300 dark:stroke-pink-800"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M130,70 Q140,35 125,25"
          className="fill-none stroke-pink-300 dark:stroke-pink-800"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Eyes */}
      <g>
        <circle cx="85" cy="85" r="6" className="fill-white" />
        <circle cx="115" cy="85" r="6" className="fill-white" />
        <motion.g
          animate={{ y: [0, 1, 0, 1, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
        >
          <circle cx="85" cy="85" r="3" className="fill-pink-900 dark:fill-pink-300" />
          <circle cx="115" cy="85" r="3" className="fill-pink-900 dark:fill-pink-300" />
        </motion.g>
      </g>

      {/* Nose */}
      <ellipse cx="100" cy="95" rx="6" ry="4" className="fill-pink-300 dark:fill-pink-700" />

      {/* Mouth */}
      <motion.path
        d="M90,105 Q100,115 110,105"
        className="fill-none stroke-pink-900 dark:stroke-pink-300"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ d: ["M90,105 Q100,115 110,105", "M90,105 Q100,110 110,105", "M90,105 Q100,115 110,105"] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
      />

      {/* Cheeks */}
      <circle cx="75" cy="100" r="7" className="fill-pink-300 dark:fill-pink-700" opacity="0.5" />
      <circle cx="125" cy="100" r="7" className="fill-pink-300 dark:fill-pink-700" opacity="0.5" />

      {/* Arms */}
      <motion.g
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut" }}
        style={{ originX: "80px", originY: "120px" }}
      >
        <ellipse cx="70" cy="120" rx="10" ry="7" className="fill-pink-200 dark:fill-pink-900" />
      </motion.g>
      <motion.g
        animate={{ rotate: [5, -5, 5] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut" }}
        style={{ originX: "120px", originY: "120px" }}
      >
        <ellipse cx="130" cy="120" rx="10" ry="7" className="fill-pink-200 dark:fill-pink-900" />
      </motion.g>

      {/* Feet */}
      <motion.g
        animate={{ y: [0, 2, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
      >
        <ellipse cx="85" cy="160" rx="12" ry="8" className="fill-pink-200 dark:fill-pink-900" />
        <ellipse cx="115" cy="160" rx="12" ry="8" className="fill-pink-200 dark:fill-pink-900" />
      </motion.g>

      {/* Loading dots */}
      <motion.g
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", staggerChildren: 0.3 }}
      >
        <motion.circle
          cx="140"
          cy="90"
          r="5"
          className="fill-pink-400 dark:fill-pink-500"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", delay: 0 }}
        />
        <motion.circle
          cx="155"
          cy="90"
          r="5"
          className="fill-pink-400 dark:fill-pink-500"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.circle
          cx="170"
          cy="90"
          r="5"
          className="fill-pink-400 dark:fill-pink-500"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", delay: 0.6 }}
        />
      </motion.g>
    </motion.svg>
  </div>
)

const CatLoader = ({ size }) => (
  <div className={cn("relative", size)}>
    <motion.svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      initial={{ y: 0 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
    >
      {/* Body */}
      <motion.ellipse
        cx="100"
        cy="130"
        rx="45"
        ry="35"
        className="fill-orange-200 dark:fill-orange-900"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
      />

      {/* Head */}
      <circle cx="100" cy="85" r="35" className="fill-orange-200 dark:fill-orange-900" />

      {/* Ears */}
      <motion.g
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
        style={{ originX: "100px", originY: "60px" }}
      >
        <polygon points="70,60 60,20 85,50" className="fill-orange-200 dark:fill-orange-900" />
        <polygon points="130,60 140,20 115,50" className="fill-orange-200 dark:fill-orange-900" />
        <polygon points="72,60 62,25 87,50" className="fill-orange-300 dark:fill-orange-800" />
        <polygon points="128,60 138,25 113,50" className="fill-orange-300 dark:fill-orange-800" />
      </motion.g>

      {/* Eyes */}
      <g>
        <circle cx="85" cy="80" r="8" className="fill-white" />
        <circle cx="115" cy="80" r="8" className="fill-white" />
        <motion.g
          animate={{
            scaleY: [1, 0.2, 1],
            y: [0, 2, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 5,
            ease: "easeInOut",
            times: [0, 0.02, 0.04],
          }}
        >
          <circle cx="85" cy="80" r="4" className="fill-orange-900 dark:fill-orange-300" />
          <circle cx="115" cy="80" r="4" className="fill-orange-900 dark:fill-orange-300" />
        </motion.g>
      </g>

      {/* Nose */}
      <polygon points="100,90 96,95 104,95" className="fill-orange-300 dark:fill-orange-700" />

      {/* Mouth */}
      <motion.path
        d="M90,100 Q100,110 110,100"
        className="fill-none stroke-orange-900 dark:stroke-orange-300"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ d: ["M90,100 Q100,110 110,100", "M90,100 Q100,105 110,100", "M90,100 Q100,110 110,100"] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
      />

      {/* Whiskers */}
      <motion.g
        animate={{ x: [-1, 1, -1] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
      >
        <line x1="65" y1="95" x2="85" y2="93" className="stroke-orange-900 dark:stroke-orange-300" strokeWidth="1.5" />
        <line
          x1="65"
          y1="100"
          x2="85"
          y2="100"
          className="stroke-orange-900 dark:stroke-orange-300"
          strokeWidth="1.5"
        />
        <line
          x1="65"
          y1="105"
          x2="85"
          y2="107"
          className="stroke-orange-900 dark:stroke-orange-300"
          strokeWidth="1.5"
        />

        <line
          x1="135"
          y1="95"
          x2="115"
          y2="93"
          className="stroke-orange-900 dark:stroke-orange-300"
          strokeWidth="1.5"
        />
        <line
          x1="135"
          y1="100"
          x2="115"
          y2="100"
          className="stroke-orange-900 dark:stroke-orange-300"
          strokeWidth="1.5"
        />
        <line
          x1="135"
          y1="105"
          x2="115"
          y2="107"
          className="stroke-orange-900 dark:stroke-orange-300"
          strokeWidth="1.5"
        />
      </motion.g>

      {/* Paws */}
      <motion.g
        animate={{ y: [0, 2, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
      >
        <ellipse cx="75" cy="160" rx="12" ry="8" className="fill-orange-200 dark:fill-orange-900" />
        <ellipse cx="125" cy="160" rx="12" ry="8" className="fill-orange-200 dark:fill-orange-900" />
      </motion.g>

      {/* Tail */}
      <motion.path
        d="M140,130 Q160,110 170,130 Q160,150 140,130"
        className="fill-orange-200 dark:fill-orange-900"
        animate={{ rotate: [-10, 10, -10] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
        style={{ originX: "140px", originY: "130px" }}
      />

      {/* Loading dots */}
      <motion.g>
        <motion.circle
          cx="50"
          cy="90"
          r="5"
          className="fill-orange-400 dark:fill-orange-500"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", delay: 0 }}
        />
        <motion.circle
          cx="35"
          cy="90"
          r="5"
          className="fill-orange-400 dark:fill-orange-500"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.circle
          cx="20"
          cy="90"
          r="5"
          className="fill-orange-400 dark:fill-orange-500"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", delay: 0.6 }}
        />
      </motion.g>
    </motion.svg>
  </div>
)

const DuckLoader = ({ size }) => (
  <div className={cn("relative", size)}>
    <motion.svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8, ease: "easeInOut" }}
    >
      {/* Body */}
      <motion.ellipse
        cx="100"
        cy="130"
        rx="45"
        ry="35"
        className="fill-yellow-200 dark:fill-yellow-700"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8, ease: "easeInOut" }}
      />

      {/* Head */}
      <circle cx="100" cy="85" r="35" className="fill-yellow-200 dark:fill-yellow-700" />

      {/* Eyes */}
      <g>
        <circle cx="85" cy="75" r="8" className="fill-white" />
        <circle cx="115" cy="75" r="8" className="fill-white" />
        <motion.g
          animate={{ y: [0, 1, 0, 1, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
        >
          <circle cx="85" cy="75" r="4" className="fill-gray-900 dark:fill-gray-300" />
          <circle cx="115" cy="75" r="4" className="fill-gray-900 dark:fill-gray-300" />
        </motion.g>
      </g>

      {/* Bill */}
      <motion.g
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
        style={{ originX: "100px", originY: "90px" }}
      >
        <ellipse cx="100" cy="100" rx="20" ry="15" className="fill-orange-400 dark:fill-orange-500" />
        <ellipse cx="100" cy="95" rx="18" ry="10" className="fill-orange-300 dark:fill-orange-600" />
      </motion.g>

      {/* Wings */}
      <motion.ellipse
        cx="70"
        cy="130"
        rx="15"
        ry="25"
        className="fill-yellow-300 dark:fill-yellow-600"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
        style={{ originX: "75px", originY: "120px" }}
      />
      <motion.ellipse
        cx="130"
        cy="130"
        rx="15"
        ry="25"
        className="fill-yellow-300 dark:fill-yellow-600"
        animate={{ rotate: [5, -5, 5] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
        style={{ originX: "125px", originY: "120px" }}
      />

      {/* Feet */}
      <motion.g
        animate={{ y: [0, 3, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8, ease: "easeInOut" }}
      >
        <path
          d="M85,160 L75,170 L85,170 L95,170 Z"
          className="fill-orange-400 dark:fill-orange-500"
          transform="rotate(10, 85, 165)"
        />
        <path
          d="M115,160 L105,170 L115,170 L125,170 Z"
          className="fill-orange-400 dark:fill-orange-500"
          transform="rotate(-10, 115, 165)"
        />
      </motion.g>

      {/* Loading dots */}
      <motion.g>
        <motion.circle
          cx="150"
          cy="85"
          r="5"
          className="fill-yellow-500 dark:fill-yellow-400"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", delay: 0 }}
        />
        <motion.circle
          cx="165"
          cy="85"
          r="5"
          className="fill-yellow-500 dark:fill-yellow-400"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.circle
          cx="180"
          cy="85"
          r="5"
          className="fill-yellow-500 dark:fill-yellow-400"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", delay: 0.6 }}
        />
      </motion.g>
    </motion.svg>
  </div>
)

const BlobLoader = ({ size }) => (
  <div className={cn("relative", size)}>
    <motion.svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "linear" }}
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="stop-color-purple-400 dark:stop-color-purple-600" />
          <stop offset="100%" className="stop-color-pink-400 dark:stop-color-pink-600" />
        </linearGradient>
      </defs>

      <motion.path
        d="M40.4,-69.2C52.9,-62.3,63.8,-52.1,71.3,-39.5C78.8,-26.9,82.9,-13.5,81.9,-0.6C80.9,12.3,74.8,24.6,67.2,36.2C59.6,47.8,50.5,58.7,38.8,65.9C27.1,73.1,13.5,76.6,0.2,76.3C-13.2,76,-26.3,71.9,-38.2,64.7C-50.1,57.5,-60.7,47.2,-67.8,34.7C-74.9,22.2,-78.5,7.4,-77.4,-7.1C-76.3,-21.6,-70.6,-35.8,-61.2,-46.9C-51.8,-58,-38.8,-66,-25.5,-70.9C-12.2,-75.8,1.3,-77.6,14.4,-75.1C27.5,-72.6,27.9,-76.1,40.4,-69.2Z"
        transform="translate(100 100)"
        className="fill-purple-400 dark:fill-purple-600"
        animate={{
          d: [
            "M40.4,-69.2C52.9,-62.3,63.8,-52.1,71.3,-39.5C78.8,-26.9,82.9,-13.5,81.9,-0.6C80.9,12.3,74.8,24.6,67.2,36.2C59.6,47.8,50.5,58.7,38.8,65.9C27.1,73.1,13.5,76.6,0.2,76.3C-13.2,76,-26.3,71.9,-38.2,64.7C-50.1,57.5,-60.7,47.2,-67.8,34.7C-74.9,22.2,-78.5,7.4,-77.4,-7.1C-76.3,-21.6,-70.6,-35.8,-61.2,-46.9C-51.8,-58,-38.8,-66,-25.5,-70.9C-12.2,-75.8,1.3,-77.6,14.4,-75.1C27.5,-72.6,27.9,-76.1,40.4,-69.2Z",
            "M47.7,-73.8C62.3,-67.3,75.1,-55.5,81.3,-41.1C87.5,-26.7,87.1,-9.6,83.2,6.1C79.3,21.8,71.9,36.1,61.8,48.4C51.7,60.7,38.8,71,24.4,75.8C10,80.6,-5.9,79.9,-20.8,75.3C-35.7,70.7,-49.6,62.2,-60.9,50.3C-72.2,38.4,-80.9,23.1,-83.1,6.7C-85.3,-9.8,-81,-27.3,-71.8,-41.1C-62.6,-54.9,-48.5,-65,-34.1,-70.9C-19.7,-76.8,-4.9,-78.5,9.4,-77.1C23.7,-75.7,33.1,-80.3,47.7,-73.8Z",
            "M40.4,-69.2C52.9,-62.3,63.8,-52.1,71.3,-39.5C78.8,-26.9,82.9,-13.5,81.9,-0.6C80.9,12.3,74.8,24.6,67.2,36.2C59.6,47.8,50.5,58.7,38.8,65.9C27.1,73.1,13.5,76.6,0.2,76.3C-13.2,76,-26.3,71.9,-38.2,64.7C-50.1,57.5,-60.7,47.2,-67.8,34.7C-74.9,22.2,-78.5,7.4,-77.4,-7.1C-76.3,-21.6,-70.6,-35.8,-61.2,-46.9C-51.8,-58,-38.8,-66,-25.5,-70.9C-12.2,-75.8,1.3,-77.6,14.4,-75.1C27.5,-72.6,27.9,-76.1,40.4,-69.2Z",
          ],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 8, ease: "easeInOut" }}
      />

      <motion.g
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0, -10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
        style={{ originX: "100px", originY: "100px" }}
      >
        {/* Eyes */}
        <circle cx="80" cy="90" r="10" className="fill-white" />
        <circle cx="120" cy="90" r="10" className="fill-white" />
        <motion.g
          animate={{
            y: [0, 1, 0, 1, 0],
            x: [0, 1, 0, -1, 0],
          }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
        >
          <circle cx="80" cy="90" r="5" className="fill-purple-900 dark:fill-purple-300" />
          <circle cx="120" cy="90" r="5" className="fill-purple-900 dark:fill-purple-300" />
        </motion.g>

        {/* Mouth */}
        <motion.path
          d="M85,115 Q100,130 115,115"
          className="fill-none stroke-purple-900 dark:stroke-purple-300"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ d: ["M85,115 Q100,130 115,115", "M85,115 Q100,125 115,115", "M85,115 Q100,130 115,115"] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
        />

        {/* Blush */}
        <circle cx="70" cy="110" r="8" className="fill-pink-400 dark:fill-pink-600" opacity="0.5" />
        <circle cx="130" cy="110" r="8" className="fill-pink-400 dark:fill-pink-600" opacity="0.5" />
      </motion.g>

      {/* Loading dots */}
      <motion.g>
        <motion.circle
          cx="100"
          cy="160"
          r="6"
          className="fill-white"
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", delay: 0 }}
        />
        <motion.circle
          cx="120"
          cy="160"
          r="6"
          className="fill-white"
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.circle
          cx="140"
          cy="160"
          r="6"
          className="fill-white"
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut", delay: 0.6 }}
        />
      </motion.g>
    </motion.svg>
  </div>
)
