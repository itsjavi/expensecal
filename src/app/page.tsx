import Link from 'next/link'

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Track Your Subscriptions</h1>
          <p className="py-6">Get an overview of your yearly expenses and see where your money goes. Start tracking your subscriptions today!</p>
          <Link href="/dashboard" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </div>
  )
}