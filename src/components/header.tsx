'use client'

import { Button } from '@/components/ui/button'
import { useMounted } from '@/hooks/use-mounted'
import { MoonIcon, SunIcon } from 'lucide-react'
import type { Session } from 'next-auth'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function Header({ session }: { session: Session | null }) {
  const { theme, setTheme } = useTheme()
  const isMounted = useMounted()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          ExpenseTracker
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            {session ? (
              <>
                <li>
                  <Button variant="ghost" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" asChild>
                    <Link href="/settings">Settings</Link>
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" asChild>
                    <Link href="/api/auth/signout">Sign Out</Link>
                  </Button>
                </li>
              </>
            ) : (
              <li>
                <Button variant="ghost" asChild>
                  <Link href="/api/auth/signin">Sign In</Link>
                </Button>
              </li>
            )}
            <li>
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {isMounted && theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
