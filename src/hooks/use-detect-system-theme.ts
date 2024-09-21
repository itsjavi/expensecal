import { useEffect, useState } from 'react'

export function useDetectSystemTheme() {
  const [theme, setTheme] = useState<string | undefined>(undefined)

  useEffect(() => {
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    setTheme(theme)
  }, [])

  return theme
}
