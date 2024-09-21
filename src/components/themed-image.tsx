'use client'

import { useTheme } from 'next-themes'
import Image, { type ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

interface ThemedImageProps extends Omit<ImageProps, 'src'> {
  src: {
    light: string
    dark: string
  }
}

export function ThemedImage({ src, ...props }: ThemedImageProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const currentSrc = theme === 'dark' ? src.dark : src.light

  return <Image src={currentSrc} {...props} />
}
