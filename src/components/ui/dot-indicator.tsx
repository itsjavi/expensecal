import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

export function DotIndicator({
  absolute,
  className,
  children,
  ...rest
}: ComponentProps<'span'> & {
  absolute?: boolean
}) {
  const absClasses = absolute ? 'absolute -top-2 -right-4' : ''
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-4 h-4 font-light text-[11px] rounded-full',
        'align-middle bg-blue-600 text-white aspect-square',
        className,
        absClasses,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
