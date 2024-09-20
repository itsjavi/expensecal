import { getSubscriptions } from '@/app/actions/subscriptions'
import CalendarView from '@/components/CalendarView'
import SubscriptionForm from '@/components/SubscriptionForm'
import SubscriptionList from '@/components/SubscriptionList'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  const subscriptions = await getSubscriptions(session.user.id)

  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Your Expenses</h2>
          <SubscriptionList subscriptions={subscriptions} currency={session.user.currency} />
          <SubscriptionForm currency={session.user.currency} />
        </div>
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Yearly Overview</h2>
          <CalendarView subscriptions={subscriptions} currency={session.user.currency} />
        </div>
      </div>
    </div>
  )
}
