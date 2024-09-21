'use client'

import { Button } from '@/components/ui/button'
import { useDetectSystemTheme } from '@/hooks/use-detect-system-theme'
import { useMounted } from '@/hooks/use-mounted'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const systemTheme = useDetectSystemTheme()
  const isMounted = useMounted()

  const actualTheme = theme === 'system' || !theme ? systemTheme : theme

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(actualTheme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
    >
      {isMounted && actualTheme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
    </Button>
  )
}
