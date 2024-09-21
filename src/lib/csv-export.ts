import { type Transaction } from '@/models/schema'
import { writeToString } from 'fast-csv'
import { getDaySubscriptions } from './calc'

export async function exportRecurringExpenses(subscriptions: Transaction[]): Promise<string> {
  const rows = subscriptions.map((sub) => ({
    name: sub.title,
    amount: sub.cost,
    frequency: sub.recurringType,
    category: sub.category,
    fromDate: sub.startingMonth ? new Date(sub.startingMonth * 30 * 24 * 60 * 60 * 1000).toISOString() : '',
    toDate: '', // Assuming there's no endingMonth field in the current schema
    dayOfMonth: sub.dayOfMonth,
    monthlyRecurringMonths: sub.customRecurringMonths || '',
  }))

  return writeToString(rows, { headers: true })
}

export async function exportMonthlyExpenses(
  subscriptions: Transaction[],
  year: number,
  month: number,
): Promise<string> {
  const rows: any[] = []
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const daySubscriptions = getDaySubscriptions(subscriptions, day, month, year)
    // const dailyExpenseTotal = calculateDailyExpense(daySubscriptions, day, month, year)

    daySubscriptions.forEach((sub) => {
      rows.push({
        name: sub.title,
        amount: sub.cost,
        day,
        month: month + 1,
        year,
        category: sub.category,
      })
    })
  }

  return writeToString(rows, { headers: true })
}

export async function exportYearlyExpenses(subscriptions: Transaction[], year: number): Promise<string> {
  const rows: any[] = []

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    for (let day = 1; day <= daysInMonth; day++) {
      const daySubscriptions = getDaySubscriptions(subscriptions, day, month, year)
      // const dailyExpenseTotal = calculateDailyExpense(daySubscriptions, day, month, year)

      daySubscriptions.forEach((sub) => {
        rows.push({
          name: sub.title,
          amount: sub.cost,
          day,
          month: month + 1,
          year,
          category: sub.category,
        })
      })
    }
  }

  return writeToString(rows, { headers: true })
}
