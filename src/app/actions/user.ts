'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/models/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateUserSettings({ currency }: { currency: string }) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')

  await db.update(users).set({ currency }).where(eq(users.id, session.user.id))
  revalidatePath('/settings')
}

export async function deleteUser() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')

  await db.delete(users).where(eq(users.id, session.user.id))
  // Note: You might want to add logic here to delete related data (subscriptions, etc.)
  revalidatePath('/')
}
