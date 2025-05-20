
import { Link } from "react-router-dom"
import { Github, Twitter, Instagram } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
            >
              EarnBug
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
              Empowering creativity with AI tools for image generation, voice conversion, and intelligent conversations.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Services
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/image-generation"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Image Generation
                </Link>
              </li>
              <li>
                <Link
                  to="/text-to-voice"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Text to Voice
                </Link>
              </li>
              <li>
                <Link
                  to="/voice-to-text"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Voice to Text
                </Link>
              </li>
              <li>
                <Link
                  to="/chatbot"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Chat Bot
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} EarnBug. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer