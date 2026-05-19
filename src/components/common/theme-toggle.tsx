"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/common/theme-provider"

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, toggleTheme } = useTheme()

  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Toggle theme"
        title="Toggle theme"
      />
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

