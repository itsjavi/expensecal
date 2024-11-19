import { accounts, authenticators, sessions, users, verificationTokens, type UserRecord } from '@/models/schema'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth, { type DefaultSession } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { db } from './db'

type SessionUserDTO = DefaultSession['user'] & {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  currency: string | null
  // ... other user properties
}

declare module 'next-auth' {
  interface Session {
    user: SessionUserDTO
  }
}

declare module 'next-auth/adapters' {
  interface AdapterSession {
    user: SessionUserDTO
  }

  interface AdapterUser extends UserRecord {}
}

declare module '@auth/core/adapters' {
  interface AdapterSession {
    user: SessionUserDTO
  }

  interface AdapterUser extends UserRecord {}
}

export const providers = [
  {
    id: 'github',
    name: 'GitHub',
    provider: GithubProvider,
  },
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    accountsTable: accounts,
    usersTable: users,
    authenticatorsTable: authenticators,
    verificationTokensTable: verificationTokens,
    sessionsTable: sessions,
  }),
  providers: providers.map((provider) => provider.provider),
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.currency = user.currency
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    newUser: '/settings',
    // signOut: '/auth/signout',
  },
})

export async function assureSessionWithUser() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('You must be logged in to perform this action')
  }

  return session
}

// @see https://authjs.dev/getting-started/installation?framework=Next.js
// in middleware.ts, add optional Middleware to keep the session alive, this will update the session expiry every time its called.
// export { auth as middleware } from "@/auth"
