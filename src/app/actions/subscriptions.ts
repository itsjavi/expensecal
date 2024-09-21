'use server'

import { assureSessionWithUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { subscriptions } from '@/models/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function addSubscription(formData: FormData) {
  const session = await assureSessionWithUser()

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const cost = parseInt(formData.get('cost') as string, 10)
  const dayOfMonth = parseInt(formData.get('dayOfMonth') as string, 10)
  const recurringType = formData.get('recurringType') as 'weekly' | 'fortnightly' | 'monthly' | 'yearly' | 'custom'
  const customRecurringMonths =
    recurringType === 'custom' ? parseInt(formData.get('customRecurringMonths') as string, 10) : null
  const startingMonth = parseInt(formData.get('startingMonth') as string, 10)

  await db.insert(subscriptions).values({
    userId: session.user.id,
    title,
    category: category as any,
    cost,
    dayOfMonth,
    recurringType,
    customRecurringMonths,
    startingMonth,
  })

  revalidatePath('/dashboard')
}

export async function updateSubscription(formData: FormData) {
  await assureSessionWithUser()

  const id = parseInt(formData.get('id') as string, 10)
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const cost = parseInt(formData.get('cost') as string, 10)
  const dayOfMonth = parseInt(formData.get('dayOfMonth') as string, 10)
  const recurringType = formData.get('recurringType') as 'weekly' | 'fortnightly' | 'monthly' | 'yearly' | 'custom'
  const customRecurringMonths =
    recurringType === 'custom' ? parseInt(formData.get('customRecurringMonths') as string, 10) : null
  const startingMonth = parseInt(formData.get('startingMonth') as string, 10)

  await db
    .update(subscriptions)
    .set({
      title,
      category: category as any,
      cost,
      dayOfMonth,
      recurringType,
      customRecurringMonths,
      startingMonth,
    })
    .where(eq(subscriptions.id, id))

  revalidatePath('/dashboard')
}

export async function getSubscriptions() {
  const session = await assureSessionWithUser()

  return db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id))
    .orderBy(subscriptions.category, subscriptions.startingMonth, subscriptions.dayOfMonth)
}

export async function deleteSubscription(id: number) {
  await assureSessionWithUser()

  await db.delete(subscriptions).where(eq(subscriptions.id, id))
  revalidatePath('/dashboard')
}
