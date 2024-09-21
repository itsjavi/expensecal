import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { MotionDiv } from '@/lib/framer'
import Link from 'next/link'

export default async function Home() {
  const session = await auth()

  return (
    <div className="container mx-auto px-4 py-16">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-6">Are you aware of how many subscriptions you have?</h1>
        <p className="text-xl mb-8">Track your expenses with ease, and get clear monthly and yearly overviews.</p>
        {session ? (
          <Link href="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        ) : (
          <Link href="/api/auth/signin">
            <Button size="lg">Get Started</Button>
          </Link>
        )}
      </MotionDiv>
    </div>
  )
}
