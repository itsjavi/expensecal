import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChartPieIcon, GithubIcon, LogOut, MessageSquareMoreIcon, Settings } from 'lucide-react'
import type { Session } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default function Header({ session }: { session: Session | null }) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-lg md:text-2xl font-bold inline-flex items-center">
          <Image
            src="/favicon.png"
            alt="ExpenseCal"
            width={32}
            height={32}
            className="mr-2 inline-block dark:brightness-200 dark:grayscale"
          />
          ExpenseCal
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">{/* Add search functionality here if needed */}</div>
          <nav className="flex items-center space-x-4">
            {session && (
              <Button variant="ghost" asChild className="hidden md:block">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            )}
            <ThemeToggle />

            <Button asChild variant="ghost" size="icon" aria-label="Toggle theme">
              <a href="https://github.com/itsjavi/expensecal" target="_blank" rel="noopener noreferrer">
                <GithubIcon className="h-5 w-5" />
              </a>
            </Button>
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || 'User'} />
                    <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center md:hidden">
                      <ChartPieIcon className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://github.com/itsjavi/expensecal/discussions" className="flex items-center">
                      <MessageSquareMoreIcon className="mr-2 h-4 w-4" />
                      <span>Send Feedback</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/api/auth/signout" className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/api/auth/signin">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
