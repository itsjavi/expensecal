import { getSubscriptions } from '@/app/actions/subscriptions'
import { DashboardMetrics } from '@/components/dashboard-metrics'
import ExpenseCalendar from '@/components/expense-calendar'
import ExpenseCharts from '@/components/expense-charts'
import ExpenseList from '@/components/expense-list'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/models/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect('/api/auth/signin')
  }

  const subscriptions = await getSubscriptions()

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((rows) => rows[0])

  if (!user) {
    console.error('User not found', session.user.id)
    redirect('/api/auth/signin')
  }

  const hasSubscriptions = subscriptions.length > 0

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      {hasSubscriptions && (
        <div className="mb-8">
          <DashboardMetrics
            subscriptions={subscriptions}
            currency={session.user.currency}
            monthlyIncome={user.monthlyIncome ?? 0}
            monthlyBudget={user.monthlyBudget ?? 0}
          />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8 min-h-[300px]">
        <div className="lg:col-span-2">
          <ExpenseList subscriptions={subscriptions} currency={session.user.currency} />
        </div>
        <div className="lg:col-span-2">
          <ExpenseCharts
            subscriptions={subscriptions}
            currency={session.user.currency}
            monthlyIncome={user.monthlyIncome ?? 0}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8">
        <ExpenseCalendar subscriptions={subscriptions} currency={session.user.currency} />
      </div>
    </>
  )
}
