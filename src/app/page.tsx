import Link from 'next/link'

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold">Are you really aware of how many subscriptions you have?</h1>
          <p className="py-6">
            Get an overview of your monthly and yearly expenses and see where your money goes. Start tracking your
            expenses today!
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}
