import BaseLayout from '@/components/base-layout'
import Providers from '@/components/providers'
import { auth } from '@/lib/auth'
import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ExpenseCal',
  description: 'Track your monthly and yearly expenses and view them in a calendar',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers session={session}>
          <BaseLayout session={session}>{children}</BaseLayout>
        </Providers>
      </body>
    </html>
  )
}
