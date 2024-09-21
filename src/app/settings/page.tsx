import SettingsForm from '@/components/settings-form'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Settings() {
  const session = await auth()

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <SettingsForm />
    </>
  )
}
