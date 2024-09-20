import { auth } from '@/lib/auth'
import Link from 'next/link'

export default async function BaseLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">
            Subscription Tracker
          </Link>
        </div>
        <div className="flex-none">
          {session ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={session.user?.image || ''} alt={session.user?.name || ''} />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link href="/settings">Settings</Link>
                </li>
                <li>
                  <Link href="/api/auth/signout">Logout</Link>
                </li>
              </ul>
            </div>
          ) : (
            <Link href="/api/auth/signin" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
      <main className="container mx-auto p-4">{children}</main>
    </>
  )
}
