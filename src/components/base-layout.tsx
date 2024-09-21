import Footer from '@/components/footer'
import Header from '@/components/header'
import type { Session } from 'next-auth'

export default function BaseLayout({ children, session }: { children: React.ReactNode; session: Session | null }) {
  return (
    <div className="flex flex-col min-h-screen min-w-[310px]">
      <Header session={session} />
      <main className="bg-neutral-50 dark:bg-black flex flex-col flex-grow">
        <div className="mx-auto px-4 py-8 w-full max-w-6xl flex flex-col flex-grow">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
