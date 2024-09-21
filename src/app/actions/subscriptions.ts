'use server'

import { assureSessionWithUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { transactions } from '@/models/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function addSubscription(formData: FormData) {
  const session = await assureSessionWithUser()

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const amount = parseInt(formData.get('amount') as string, 10)
  const monthlyDay = parseInt(formData.get('dayOfMonth') as string, 10)
  const recurringType = formData.get('recurringType') as 'weekly' | 'fortnightly' | 'monthly' | 'yearly' | 'custom'
  const monthlyCustomRecurringMonths =
    recurringType === 'custom' ? parseInt(formData.get('customRecurringMonths') as string, 10) : null
  const startingMonth = parseInt(formData.get('startingMonth') as string, 10)

  await db.insert(transactions).values({
    userId: session.user.id,
    title,
    category: category as any,
    amount,
    monthlyDay,
    recurringType,
    monthlyCustomRecurringMonths,
    startingMonth,
  })

  revalidatePath('/dashboard')
}

export async function updateSubscription(formData: FormData) {
  await assureSessionWithUser()

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const amount = parseInt(formData.get('cost') as string, 10)
  const monthlyDay = parseInt(formData.get('dayOfMonth') as string, 10)
  const recurringType = formData.get('recurringType') as 'weekly' | 'fortnightly' | 'monthly' | 'yearly' | 'custom'
  const monthlyCustomRecurringMonths =
    recurringType === 'custom' ? parseInt(formData.get('customRecurringMonths') as string, 10) : null
  const startingMonth = parseInt(formData.get('startingMonth') as string, 10)

  await db
    .update(transactions)
    .set({
      title,
      category: category as any,
      amount,
      monthlyDay,
      recurringType,
      monthlyCustomRecurringMonths,
      startingMonth,
    })
    .where(eq(transactions.id, id))

  revalidatePath('/dashboard')
}

export async function getSubscriptions() {
  const session = await assureSessionWithUser()

  return db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, session.user.id))
    .orderBy(transactions.category, transactions.startingMonth, transactions.monthlyDay)
}

export async function deleteSubscription(id: string) {
  await assureSessionWithUser()

  await db.delete(transactions).where(eq(transactions.id, id))
  revalidatePath('/dashboard')
}
