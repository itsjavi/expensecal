import SettingsForm from '@/components/settings-form'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/models/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/api/auth/signin')

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((rows) => rows[0])

  if (!user) throw new Error('User not found')

  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <SettingsForm
        initialCurrency={user.currency ?? 'USD'} // Provide a default value if currency is null
        initialMonthlyIncome={user.monthlyIncome}
        initialMonthlyBudget={user.monthlyBudget}
      />
    </div>
  )
}
