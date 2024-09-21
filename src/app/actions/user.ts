'use server'

import { assureSessionWithUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/models/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateUserSettings({
  currency,
  monthlyIncome,
  monthlyBudget,
}: {
  currency: string
  monthlyIncome: number
  monthlyBudget: number
}) {
  const session = await assureSessionWithUser()

  await db.update(users).set({ currency, monthlyIncome, monthlyBudget }).where(eq(users.id, session.user.id))
  revalidatePath('/settings')
}

export async function deleteUser() {
  const session = await assureSessionWithUser()

  await db.delete(users).where(eq(users.id, session.user.id))
  // Note: You might want to add logic here to delete related data (subscriptions, etc.)
  revalidatePath('/')
}
