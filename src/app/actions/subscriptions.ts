'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { subscriptions } from '@/models/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function addSubscription(data: {
  title: string
  logo: string
  cost: number
  dayOfMonth: number
  recurringType: 'weekly' | 'fortnightly' | 'monthly' | 'yearly' | 'custom'
  customRecurringMonths?: number
  startingMonth: number
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')

  await db.insert(subscriptions).values({
    userId: session.user.id,
    ...data,
    cost: Math.round(data.cost * 100), // Convert to cents
  })
  revalidatePath('/dashboard')
}

export async function updateSubscription(
  id: number,
  data: Partial<{
    title: string
    logo: string
    cost: number
    dayOfMonth: number
    recurringType: 'weekly' | 'fortnightly' | 'monthly' | 'yearly' | 'custom'
    customRecurringMonths?: number
    startingMonth: number
  }>,
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')
  await db
    .update(subscriptions)
    .set({
      ...data,
      cost: data.cost ? Math.round(data.cost * 100) : undefined, // Convert to cents if provided
    })
    .where(eq(subscriptions.id, id))
  revalidatePath('/dashboard')
}

export async function deleteSubscription(id: number) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')
  await db.delete(subscriptions).where(eq(subscriptions.id, id))
  revalidatePath('/dashboard')
}

export async function getSubscriptions(userId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')
  return await db.select().from(subscriptions).where(eq(subscriptions.userId, userId))
}
