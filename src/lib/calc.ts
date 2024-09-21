import { type Subscription } from '@/models/schema'

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
  dailySubscriptions: Subscription[],
  day: number,
  monthIndex: number,
  year: number,
) => {
  return dailySubscriptions.reduce((total, sub) => {
    const startMonth = sub.startingMonth || 0
    if (monthIndex < startMonth) return total

    const isFortnightlyDay = sub.recurringType === 'fortnightly'
    const [firstDay, secondDay] = isFortnightlyDay ? getFortnightlyDays(year, monthIndex, sub.dayOfMonth) : [day, day]

    if (sub.dayOfMonth === firstDay || sub.dayOfMonth === secondDay) {
      if (sub.recurringType === 'weekly') {
        return total + sub.cost * getFullWeeksInMonth(year, monthIndex)
      } else if (sub.recurringType === 'fortnightly') {
        return total + sub.cost
      } else if (sub.recurringType === 'monthly') {
        return total + sub.cost
      } else if (sub.recurringType === 'yearly' && monthIndex === startMonth) {
        return total + sub.cost
      } else if (sub.recurringType === 'custom') {
        const monthsSinceStart = monthIndex - startMonth
        if (monthsSinceStart % (sub.customRecurringMonths || 1) === 0) {
          return total + sub.cost
        }
      }
    }
    return total
  }, 0)
}

export const calculateMonthlyTotal = (subscriptions: Subscription[], monthIndex: number, year: number) => {
  let total = 0
  const daysInMonth = getDaysCountInMonth(year, monthIndex)
  for (let day = 1; day <= daysInMonth; day++) {
    total += calculateDailyExpense(getDaySubscriptions(subscriptions, day, monthIndex), day, monthIndex, year)
  }
  return total
}

export const getSubscriptionsForMonth = (subscriptions: Subscription[], monthIndex: number) => {
  return subscriptions.filter((sub) => {
    const startMonth = sub.startingMonth || 0
    return monthIndex >= startMonth
  })
}

export const getDaySubscriptions = (subscriptions: Subscription[], day: number, monthIndex: number) => {
  return subscriptions.filter((sub) => {
    if (sub.recurringType === 'yearly') {
      return sub.startingMonth === monthIndex && day === sub.dayOfMonth
    }
    if (sub.recurringType === 'fortnightly') {
      const [startDay, endDay] = getFortnightlyDays(new Date().getFullYear(), monthIndex, sub.dayOfMonth)
      return day === startDay || day === endDay
    }
    return sub.dayOfMonth === day
  })
}

export const calculateYearlyTotal = (subscriptions: Subscription[], year: number) => {
  return Array.from({ length: 12 }, (_, index) => index).reduce(
    (sum, monthIndex) => sum + calculateMonthlyTotal(subscriptions, monthIndex, year),
    0,
  )
}

export const calculateCategorySums = (subscriptions: Subscription[], _year: number) => {
  const categorySums: { [key: string]: number } = {}

  subscriptions.forEach((sub) => {
    const category = sub.category
    if (!categorySums[category]) {
      categorySums[category] = 0
    }

    let annualCost = 0
    switch (sub.recurringType) {
      case 'weekly':
        annualCost = sub.cost * 52
        break
      case 'fortnightly':
        annualCost = sub.cost * 26
        break
      case 'monthly':
        annualCost = sub.cost * 12
        break
      case 'yearly':
        annualCost = sub.cost
        break
      case 'custom':
        const monthsPerYear = 12 / (sub.customRecurringMonths || 12)
        annualCost = sub.cost * monthsPerYear
        break
    }

    categorySums[category] += annualCost
  })

  return Object.entries(categorySums).map(([name, value]) => ({ name, value }))
}
