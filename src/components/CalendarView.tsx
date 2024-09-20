import { type Subscription } from "@/models/schema"

export default async function CalendarView({ subscriptions }: { subscriptions: Subscription[], currency: string }) {

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <div className="grid grid-cols-3 gap-4">
      {months.map((month, index) => (
        <div key={month} className="bg-base-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{month}</h3>
          <ul className="space-y-2">
            {subscriptions
              .filter(sub => {
                const date = new Date()
                date.setMonth(index)
                date.setDate(sub.dayOfMonth)
                return (
                  sub.recurringType === 'monthly' ||
                  (sub.recurringType === 'yearly' && date.getMonth() === index) ||
                  (sub.recurringType === 'fortnightly' && index % 2 === 0) ||
                  (sub.recurringType === 'custom' && index % (sub.customRecurringMonths || 1) === 0)
                )
              })
              .map(sub => (
                <li key={sub.id} className="flex justify-between items-center">
                  <span>{sub.title}</span>
                  <span>${(sub.cost / 100).toFixed(2)}</span>
                </li>
              ))
            }
          </ul>
        </div>
      ))}
    </div>
  )
}
