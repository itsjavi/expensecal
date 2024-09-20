import BaseLayout from "@/components/BaseLayout"
import { auth } from "@/lib/auth"
import { SessionProvider } from "next-auth/react"
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Subscription Tracker',
  description: 'Track your monthly and yearly subscriptions',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <BaseLayout>{children}</BaseLayout>
        </SessionProvider>
      </body>
    </html>
  )
}
