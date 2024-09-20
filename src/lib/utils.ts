import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { isDevelopmentEnv } from '../env'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function devLog(...args: any[]) {
  if (isDevelopmentEnv()) {
    console.log(...args)
  }
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function capitalizeWords(string: string): string {
  return string.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5)
}

export function singleton<Value>(name: string, valueFactory: () => Value): Value {
  const yolo = globalThis as unknown as { __singletons: Record<string, unknown> }
  yolo.__singletons ??= {}
  yolo.__singletons[name] ??= valueFactory()
  return yolo.__singletons[name] as Value
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100) // Assuming the amount is stored in cents
}
