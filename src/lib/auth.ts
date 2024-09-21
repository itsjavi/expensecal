import { accounts, authenticators, sessions, users, verificationTokens } from '@/models/schema'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth, { type DefaultSession } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { db } from './db'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      currency: string
      // ... other user properties
    }
  }

  interface User {
    currency: string
    // ... other user properties
  }
}

// export const authOptions: NextAuthOptions = {
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     GithubProvider({
//       clientId: envVars.GITHUB_OAUTH_CLIENT_ID,
//       clientSecret: envVars.GITHUB_OAUTH_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.sub as string;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: '/auth/signin',
//   },
//   // Configure custom base URL for development
//   ...(isDevelopmentEnv()
//     ? {
//       url: envVars.NEXTAUTH_URL || `http://localhost:${process.env['PORT'] || 5091}`,
//     }
//     : {}),
// }

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

// @see https://authjs.dev/getting-started/installation?framework=Next.js
// in middleware.ts, add optional Middleware to keep the session alive, this will update the session expiry every time its called.
// export { auth as middleware } from "@/auth"
