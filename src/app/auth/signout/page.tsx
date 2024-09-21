import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { signOut } from '@/lib/auth'

export default function SignOutPage() {
  return (
    <div className="flex-grow flex justify-center items-center self-center">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="flex place-content-center">Are you sure you want to sign out?</CardTitle>
        </CardHeader>
        <CardContent className="flex place-content-center">
          <form
            className="contents"
            action={async () => {
              'use server'
              await signOut()
            }}
          >
            <Button type="submit">Sign out</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
