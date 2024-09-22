import { getExpenses } from '@/app/actions/transactions'
import { DashboardMetrics } from '@/components/dashboard-metrics'
import DateSelector from '@/components/date-selector'
import ExpenseCalendar from '@/components/expense-calendar'
import ExpenseCharts from '@/components/expense-charts'
import ExpenseList from '@/components/expense-list'
import { SelectedDateProvider } from '@/contexts/selected-date-context'
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

  const subscriptions = await getExpenses()

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
    <div className="max-w-[1200px] mx-auto flex flex-col gap-4 md:gap-8">
      <SelectedDateProvider>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <DateSelector />
        {hasSubscriptions && (
          <DashboardMetrics
            subscriptions={subscriptions}
            currency={session.user.currency}
            monthlyIncome={user.monthlyIncome ?? 0}
            monthlyBudget={user.monthlyBudget ?? 0}
            savingsGoal={user.savingsGoal ?? 0}
            initialSavings={user.initialSavings ?? 0}
          />
        )}
        <div className="grid grid-cols-1 gap-8">
          <ExpenseCalendar subscriptions={subscriptions} currency={session.user.currency} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[300px]">
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
      </SelectedDateProvider>
    </div>
  )
}
