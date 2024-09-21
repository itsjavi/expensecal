'use client'

import { useMounted } from '@/hooks/use-mounted'
import { useTheme } from 'next-themes'
import Image, { type ImageProps } from 'next/image'

interface ThemedImageProps extends Omit<ImageProps, 'src'> {
  src: {
    light: string
    dark: string
  }
}

export function ThemedImage({ src, ...props }: ThemedImageProps) {
  const { theme, systemTheme } = useTheme()
  const isMounted = useMounted()

  const currentTheme = isMounted ? (theme ?? systemTheme) : 'light'
  const currentSrc = currentTheme === 'dark' ? src.dark : src.light

  return <Image src={currentSrc} {...props} />
}
