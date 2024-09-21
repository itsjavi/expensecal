'use client'

import { useDetectSystemTheme } from '@/hooks/use-detect-system-theme'
import { useMounted } from '@/hooks/use-mounted'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import Image, { type ImageProps } from 'next/image'

interface ThemedImageProps extends Omit<ImageProps, 'src'> {
  src: {
    light: string
    dark: string
  }
}

export function ThemedImage({ src, ...props }: ThemedImageProps) {
  const { theme } = useTheme()
  const systemTheme = useDetectSystemTheme()
  const isMounted = useMounted()

  const nextTheme = theme === 'system' ? systemTheme : theme || systemTheme
  const currentTheme = isMounted ? nextTheme : 'light'
  const currentSrc = currentTheme === 'dark' ? src.dark : src.light

  const classNames = cn([
    'transition-opacity',
    'duration-800',
    {
      'opacity-0': !isMounted,
      'opacity-100': isMounted,
    },
  ])

  return <Image src={currentSrc} {...props} className={classNames} />
}
