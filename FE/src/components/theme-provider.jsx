"use client"

import { createContext, useContext, useEffect, useState } from "react"
import useAuthStore from "../store/authstore"
import Loader from "./Loader"

const ThemeProviderContext = createContext({
  theme: "light",
  setTheme: () => null,
})

export function ThemeProvider({ children, defaultTheme = "light", storageKey = "vite-ui-theme" }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme)
  const [isReady, setIsReady] = useState(false)
  const { isLoading: authLoading } = useAuthStore()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    
    // Wait for theme to be applied and auth to be ready
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  // Show loading animation until everything is ready
  if (!isReady || authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
