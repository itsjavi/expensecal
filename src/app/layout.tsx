import BaseLayout from '@/components/base-layout'
import Providers from '@/components/providers'
import { auth } from '@/lib/auth'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ExpenseCal - Personal Recurring Expense Tracker',
  description: 'Track your recurring expenses and view them in a calendar',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          // Umami analytics
          defer
          data-domain="expensecal.com"
          data-website-id="9c62a028-2171-430b-9619-07c6378c1614"
          src="https://aw.itsjavi.com/s/uma.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <Providers session={session}>
          <BaseLayout session={session}>{children}</BaseLayout>
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
