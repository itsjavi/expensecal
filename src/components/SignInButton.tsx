import { signIn } from "@/lib/auth"

export function SignInButton({ providerId, providerName }: { providerId: string, providerName: string }) {
  return (
    <form
      action={async () => {
        "use server"
        await signIn(providerId, { redirectTo: "/dashboard" })
      }}
    >
      <button type="submit">Sign in with {providerName}</button>
    </form>
  )
}
