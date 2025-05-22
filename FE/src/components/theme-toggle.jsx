import { Moon, Sun } from 'lucide-react'
import { useTheme } from "./theme-provider"
import { Button } from "./ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full w-9 h-9"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-300 transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
    </Button>
  )
}
