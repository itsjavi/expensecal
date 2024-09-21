import BaseLayout from '@/components/base-layout'
import Providers from '@/components/providers'
import { auth } from '@/lib/auth'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Subscription Tracker',
  description: 'Track your monthly and yearly subscriptions',
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
