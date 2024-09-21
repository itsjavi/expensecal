'use client'

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

interface SignInButtonProps {
  providerId: string
  providerName: string
}

export function SignInButton({ providerId, providerName }: SignInButtonProps) {
  return (
    <Button variant="outline" onClick={() => signIn(providerId)}>
      Sign in with {providerName}
    </Button>
  )
}
