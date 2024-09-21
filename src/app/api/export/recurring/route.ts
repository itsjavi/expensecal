import { auth } from '@/lib/auth'
import { exportRecurringExpenses } from '@/lib/csv-export'
import { db } from '@/lib/db'
import { transactions } from '@/models/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userSubscriptions = await db.select().from(transactions).where(eq(transactions.userId, session.user.id))
  const csv = await exportRecurringExpenses(userSubscriptions)

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=expensecal-recurring-expenses.csv',
    },
  })
}
