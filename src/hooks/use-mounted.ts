'use client'

import { useEffect, useState } from 'react'

// This helps preventing hydration errors
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
