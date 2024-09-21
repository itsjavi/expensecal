import { SignInButton } from '@/components/_prev/SignInButton'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { auth, providers } from '@/lib/auth'
import { redirect } from 'next/navigation'

// @see https://authjs.dev/guides/pages/signin

export default async function SignIn() {
  const session = await auth()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="flex-grow flex justify-center items-center self-center">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in to your account</CardTitle>
          <CardDescription>Sign in to your account to access your expense tracker</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {providers.map((provider) => (
            <SignInButton key={provider.id} providerId={provider.id} providerName={provider.name} />
          ))}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
