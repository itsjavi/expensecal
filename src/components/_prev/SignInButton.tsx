import { signIn } from '@/lib/auth'
import { Button } from '../ui/button'

export function SignInButton({ providerId, providerName }: { providerId: string; providerName: string }) {
  return (
    <form
      action={async () => {
        'use server'
        await signIn(providerId, { redirectTo: '/dashboard' })
      }}
    >
      <Button variant="outline" className="w-full" type="submit">
        {/* <Github className="mr-2 h-4 w-4" /> */}
        Sign in with {providerName}
      </Button>
    </form>
  )
}
