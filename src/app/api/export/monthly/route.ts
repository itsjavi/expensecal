import { auth } from '@/lib/auth'
import { exportMonthlyExpenses } from '@/lib/csv-export'
import { db } from '@/lib/db'
import { transactions } from '@/models/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString(), 10)
  const month = parseInt(searchParams.get('month') || new Date().getMonth().toString(), 10)

  const userSubscriptions = await db.select().from(transactions).where(eq(transactions.userId, session.user.id))
  const csv = await exportMonthlyExpenses(userSubscriptions, year, month)

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=expensecal-monthly-expenses.csv',
    },
  })
}
