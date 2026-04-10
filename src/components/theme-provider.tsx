"use client"

import * as React from "react"

type Theme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("light")

  React.useEffect(() => {
    const saved = window.localStorage.getItem("theme")
    const initial: Theme =
      saved === "dark" || saved === "light" ? (saved as Theme) : getPreferredTheme()
    setThemeState(initial)
    applyTheme(initial)
  }, [])

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t)
    try {
      window.localStorage.setItem("theme", t)
    } catch {
      // ignore
    }
    applyTheme(t)
  }, [])

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [setTheme, theme])

  const value = React.useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}

