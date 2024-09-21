import { getSubscriptions } from '@/app/actions/subscriptions'
import ExpenseCalendar from '@/components/expense-calendar'
import ExpenseCharts from '@/components/expense-charts'
import ExpenseList from '@/components/expense-list'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect('/api/auth/signin')
  }

  const subscriptions = await getSubscriptions()

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Your Expense Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-8">
        <div className="lg:col-span-2">
          <ExpenseList subscriptions={subscriptions} currency={session.user.currency} />
        </div>
        <div className="lg:col-span-4">
          <ExpenseCalendar subscriptions={subscriptions} currency={session.user.currency} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8">
        <ExpenseCharts subscriptions={subscriptions} currency={session.user.currency} />
      </div>
    </>
  )
}
