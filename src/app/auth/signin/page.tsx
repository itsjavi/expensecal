import { SignInButton } from '@/components/SignInButton'
import { auth, providers } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SignIn() {
  const session = await auth()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="max-w-md w-full space-y-8 p-10 bg-base-100 rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold">Sign in to your account</h2>
        </div>
        {providers.map((provider) => (
          <SignInButton key={provider.id} providerId={provider.id} providerName={provider.name} />
        ))}
      </div>
    </div>
  )
}
