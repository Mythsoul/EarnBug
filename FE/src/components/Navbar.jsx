

import { useState, useEffect } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => { 
  navigate("/logout")
  } 

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                EarnBug
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/image-generation"
                className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Image Generation
              </Link>
              <Link
                to="/text-to-voice"
                className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Text to Voice
              </Link>
              <Link
                to="/voice-to-text"
                className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Voice to Text
              </Link>
              <Link
                to="/chatbot"
                className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Chat Bot
              </Link>
              {/* <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button> */}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/image-generation"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Image Generation
            </Link>
            <Link
              to="/text-to-voice"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Text to Voice
            </Link>
            <Link
              to="/voice-to-text"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Voice to Text
            </Link>
            <Link
              to="/chatbot"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Chat Bot
            </Link>
            {/* <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                handleLogout()
                setIsMenuOpen(false)
              }}
            >
              Logout
            </Button> */}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar