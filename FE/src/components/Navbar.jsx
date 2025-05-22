import { useState, useEffect } from "react"
  import { Link, useNavigate, useLocation } from "react-router-dom"
import { Menu, X } from 'lucide-react'
import { Button } from "./ui/button"
import useAuthStore from "../store/authstore"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "../lib/utils"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoggedIn, setShowVerifyModal , isLoading } = useAuthStore()

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Image Generation", path: "/image-generation" },
    { name: "Text to Voice", path: "/text-to-voice" },
    { name: "Voice to Text", path: "/voice-to-text" },
    { name: "Chat Bot", path: "/chatbot" },
  ]

  const renderAuthButton = () => {
    if (!isLoggedIn) {
      return (
        <Link to="/login">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            Login
          </Button>
        </Link>
      )
    }

    if (!user?.verified) {
      return (
        <Button
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          onClick={() => setShowVerifyModal(true)}
        >
          Verify Email
        </Button>
      )
    }

    return (
      <Button
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        onClick={() => navigate("/logout")}
      >
        Logout
      </Button>
    )
  }

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm"
          : "bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm"
      )}
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

          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(link.path)
                    ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                    : "text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-zinc-800/70"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="ml-4 flex items-center space-x-2">
              <ThemeToggle />
              
              {renderAuthButton()}
            </div>
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 shadow-lg border-t border-gray-200 dark:border-zinc-800 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  isActive(link.path)
                    ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                    : "text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-zinc-800/70"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 pb-2">
              <div className="border-t border-gray-200 dark:border-zinc-700"></div>
            </div>
            <div className="px-3">
              {isLoggedIn ? (
                !user?.verified ? (
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={() => {
                      setShowVerifyModal(true)
                      setIsMenuOpen(false)
                    }}
                  >
                    Verify Email
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={() => {
                      navigate("/logout")
                      setIsMenuOpen(false)
                    }}
                  >
                    Logout
                  </Button>
                )
              ) : (
                <Link to="/login" className="block w-full">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
