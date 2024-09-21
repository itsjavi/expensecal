'use client'

import { Button } from '@/components/ui/button'
import { MotionDiv } from '@/lib/framer'
import Link from 'next/link'

interface HomeHeroProps {
  isLoggedIn: boolean
}

export function HomeHero({ isLoggedIn }: HomeHeroProps) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center pt-12 sm:pt-24"
    >
      <h1 className="text-4xl font-bold mb-6 sm:text-5xl">Master Your Expenses</h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
        Are you aware of how many subscriptions you have? Our app provides many tools to help you track, analyze, and
        optimize your expenses with ease, to help you save money.
      </p>
      {isLoggedIn ? (
        <Link href="/dashboard">
          <Button size="lg">Go to Dashboard</Button>
        </Link>
      ) : (
        <Link href="/api/auth/signin">
          <Button size="lg">Get Started</Button>
        </Link>
      )}
    </MotionDiv>
  )
}
