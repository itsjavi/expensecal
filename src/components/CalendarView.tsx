import { formatCurrency } from '@/lib/utils'
import { type Subscription } from '@/models/schema'

export default function CalendarView({ subscriptions, currency }: { subscriptions: Subscription[]; currency: string }) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const getDaysCountInMonth = (monthIndex: number) => {
    const year = new Date().getFullYear()
    return new Date(year, monthIndex + 1, 0).getDate()
  }

  const getFullWeeksInMonth = (monthIndex: number) => {
    return Math.floor(getDaysCountInMonth(monthIndex) / 7)
  }

  const calculateMonthlyTotal = (monthIndex: number) => {
    return subscriptions.reduce((total, sub) => {
      const startMonth = sub.startingMonth || 0
      if (monthIndex < startMonth) return total

      if (sub.recurringType === 'weekly') {
        const weeksInMonth = getFullWeeksInMonth(monthIndex)
        return total + sub.cost * weeksInMonth
      } else if (sub.recurringType === 'monthly') {
        return total + sub.cost
      } else if (sub.recurringType === 'yearly' && monthIndex === startMonth) {
        return total + sub.cost
      } else if (sub.recurringType === 'fortnightly') {
        return total + sub.cost * 2
      } else if (sub.recurringType === 'custom') {
        const monthsSinceStart = monthIndex - startMonth
        if (monthsSinceStart % (sub.customRecurringMonths || 1) === 0) {
          return total + sub.cost
        }
      }
      return total
    }, 0)
  }

  const getSubscriptionsForMonth = (monthIndex: number) => {
    return subscriptions.filter((sub) => {
      const startMonth = sub.startingMonth || 0
      if (monthIndex < startMonth) return false

      if (sub.recurringType === 'weekly' || sub.recurringType === 'monthly' || sub.recurringType === 'fortnightly') {
        return true
      } else if (sub.recurringType === 'yearly') {
        return monthIndex === startMonth
      } else if (sub.recurringType === 'custom') {
        const monthsSinceStart = monthIndex - startMonth
        return monthsSinceStart % (sub.customRecurringMonths || 1) === 0
      }
      return false
    })
  }

  const formatSubscriptions = (subs: Subscription[]) => {
    if (subs.length === 0) return 'No subscriptions'
    if (subs.length <= 2) return subs.map((sub) => sub.title).join(', ')
    return `${subs[0].title}, ${subs[1].title}, +${subs.length - 2} more`
  }

  const totalYearlySum = months.reduce((sum, _, index) => sum + calculateMonthlyTotal(index), 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {months.map((month, index) => (
          <div key={month} className="bg-base-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{month}</h3>
            <div className="font-bold text-yellow-200 text-lg">
              {formatCurrency(calculateMonthlyTotal(index), currency)}
            </div>
            <p className="text-sm text-base-content mb-4">{formatSubscriptions(getSubscriptionsForMonth(index))}</p>
          </div>
        ))}
      </div>
      <div className="text-xl font-bold text-center">
        Yearly Total: <span className="text-yellow-500">{formatCurrency(totalYearlySum, currency)}</span>
      </div>
    </div>
  )
}
