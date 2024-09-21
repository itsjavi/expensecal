import { deleteSubscription } from '@/app/actions/subscriptions'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { type Transaction } from '@/models/schema'

export default function SubscriptionList({
  subscriptions,
  currency,
}: {
  subscriptions: Transaction[]
  currency: string
}) {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Your Subscriptions</h2>
      {subscriptions.length === 0 ? (
        <p>You haven't added any subscriptions yet.</p>
      ) : (
        <ul className="space-y-4">
          {subscriptions.map((sub) => (
            <li key={sub.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="font-medium">{sub.title}</h3>
                <p className="text-sm text-gray-500">
                  {formatCurrency(sub.amount, currency)} / {sub.recurringType}
                </p>
              </div>
              <form action={deleteSubscription.bind(null, sub.id)}>
                <Button variant="destructive" size="sm" type="submit">
                  Delete
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
