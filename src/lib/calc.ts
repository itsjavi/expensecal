import { type Transaction } from '@/models/schema'

export const getDaysCountInMonth = (year: number, monthIndex: number) => {
  return new Date(year, monthIndex + 1, 0).getDate()
}

export const getFortnightlyDays = (year: number, monthIndex: number, startDay: number) => {
  const daysInMonth = getDaysCountInMonth(year, monthIndex)
  const secondDay = startDay + 14
  if (secondDay > daysInMonth) {
    return [startDay, startDay + 14 - daysInMonth]
  }
  return [startDay, secondDay]
}

export const getFullWeeksInMonth = (year: number, monthIndex: number) => {
  return Math.floor(getDaysCountInMonth(year, monthIndex) / 7)
}

export const calculateDailyExpense = (
  dailySubscriptions: Transaction[],
  day: number,
  monthIndex: number,
  year: number,
) => {
  return dailySubscriptions.reduce((total, sub) => {
    const startMonth = sub.startingMonth || 0
    if (monthIndex < startMonth) return total

    const isFortnightlyDay = sub.recurringType === 'fortnightly'
    const [firstDay, secondDay] = isFortnightlyDay ? getFortnightlyDays(year, monthIndex, sub.monthlyDay) : [day, day]

    if (sub.monthlyDay === firstDay || sub.monthlyDay === secondDay) {
      if (sub.recurringType === 'weekly') {
        return total + sub.amount * getFullWeeksInMonth(year, monthIndex)
      } else if (sub.recurringType === 'fortnightly') {
        return total + sub.amount
      } else if (sub.recurringType === 'monthly') {
        return total + sub.amount
      } else if (sub.recurringType === 'yearly' && monthIndex === startMonth) {
        return total + sub.amount
      } else if (sub.recurringType === 'custom') {
        const monthsSinceStart = (year - Math.floor(startMonth / 12)) * 12 + monthIndex - (startMonth % 12)
        if (monthsSinceStart % (sub.monthlyCustomRecurringMonths || 1) === 0) {
          return total + sub.amount
        }
      }
    }
    return total
  }, 0)
}

export const calculateMonthlyTotal = (subscriptions: Transaction[], monthIndex: number, year: number) => {
  let total = 0
  const daysInMonth = getDaysCountInMonth(year, monthIndex)
  for (let day = 1; day <= daysInMonth; day++) {
    const daySubscriptions = getDaySubscriptions(subscriptions, day, monthIndex, year)
    total += calculateDailyExpense(daySubscriptions, day, monthIndex, year)
  }
  return total
}

export const getExpensesForMonth = (subscriptions: Transaction[], monthIndex: number) => {
  return subscriptions.filter((sub) => {
    const startMonth = sub.startingMonth || 0
    return monthIndex >= startMonth
  })
}

export const getDaySubscriptions = (subscriptions: Transaction[], day: number, monthIndex: number, year: number) => {
  return subscriptions.filter((sub) => {
    const startMonth = sub.startingMonth || 0
    const startYear = Math.floor(startMonth / 12)
    const adjustedStartMonth = startMonth % 12

    if (year < startYear || (year === startYear && monthIndex < adjustedStartMonth)) {
      return false
    }

    if (sub.recurringType === 'yearly') {
      return monthIndex === adjustedStartMonth && day === sub.monthlyDay
    }
    if (sub.recurringType === 'fortnightly') {
      const [startDay, endDay] = getFortnightlyDays(year, monthIndex, sub.monthlyDay)
      return day === startDay || day === endDay
    }
    if (sub.recurringType === 'custom') {
      const monthsSinceStart = (year - startYear) * 12 + monthIndex - adjustedStartMonth
      return monthsSinceStart % (sub.monthlyCustomRecurringMonths || 1) === 0 && day === sub.monthlyDay
    }
    return sub.monthlyDay === day
  })
}

export const calculateYearlyTotal = (subscriptions: Transaction[], year: number) => {
  return Array.from({ length: 12 }, (_, monthIndex) => monthIndex).reduce(
    (sum, monthIndex) => sum + calculateMonthlyTotal(subscriptions, monthIndex, year),
    0,
  )
}

export const calculateCategorySums = (subscriptions: Transaction[], _year: number) => {
  const categorySums: { [key: string]: number } = {}

  subscriptions.forEach((sub) => {
    const category = sub.category
    if (!categorySums[category]) {
      categorySums[category] = 0
    }

    let annualAmount = 0
    switch (sub.recurringType) {
      case 'weekly':
        annualAmount = sub.amount * 52
        break
      case 'fortnightly':
        annualAmount = sub.amount * 26
        break
      case 'monthly':
        annualAmount = sub.amount * 12
        break
      case 'yearly':
        annualAmount = sub.amount
        break
      case 'custom':
        const monthsPerYear = 12 / (sub.monthlyCustomRecurringMonths || 12)
        annualAmount = sub.amount * monthsPerYear
        break
    }

    categorySums[category] += annualAmount
  })

  return Object.entries(categorySums).map(([name, value]) => ({ name, value }))
}

export const calculateAverageMonthlyExpenses = (subscriptions: Transaction[], year: number) => {
  const totalYearly = calculateYearlyTotal(subscriptions, year)
  return totalYearly / 12
}

export const calculateCurrentMonthExpenses = (subscriptions: Transaction[], year: number, month: number) => {
  return calculateMonthlyTotal(subscriptions, month, year)
}

export const calculateRemainingBudget = (monthlyBudget: number, currentMonthExpenses: number) => {
  return monthlyBudget - currentMonthExpenses
}

export const calculatePotentialYearlySavings = (monthlyIncome: number, yearlyExpenses: number) => {
  const yearlyIncome = monthlyIncome * 12
  return yearlyIncome - yearlyExpenses
}
