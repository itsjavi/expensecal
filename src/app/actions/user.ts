'use server'

import { assureSessionWithUser, signOut } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/models/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateUserSettings({
  currency,
  monthlyIncome,
  monthlyBudget,
  savingsGoal,
  initialSavings,
}: {
  currency: string
  monthlyIncome: number
  monthlyBudget: number
  savingsGoal: number
  initialSavings: number
}) {
  const session = await assureSessionWithUser()

  await db
    .update(users)
    .set({
      currency,
      monthlyIncome: Math.round(monthlyIncome),
      monthlyBudget: Math.round(monthlyBudget),
      savingsGoal: Math.round(savingsGoal),
      initialSavings: Math.round(initialSavings),
    })
    .where(eq(users.id, session.user.id))
  revalidatePath('/settings')
}

export async function deleteUser() {
  const session = await assureSessionWithUser()

  await db.delete(users).where(eq(users.id, session.user.id))
  await signOut()
  // Note: You might want to add logic here to delete related data (subscriptions, etc.)
  revalidatePath('/')
  revalidatePath('/settings')
}
