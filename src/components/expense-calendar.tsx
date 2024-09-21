'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { type Subscription } from '@/models/schema'
import { motion } from 'framer-motion'
import { useState } from 'react'

type ExpenseCalendarProps = {
  subscriptions: Subscription[]
  currency: string
}

export default function ExpenseCalendar({ subscriptions = [], currency }: ExpenseCalendarProps) {
  const [isMonthlyView, setIsMonthlyView] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const currentYear = new Date().getFullYear()
  const today = new Date()

  const getDaysCountInMonth = (monthIndex: number) => {
    return new Date(currentYear, monthIndex + 1, 0).getDate()
  }

  const getFortnightlyDays = (monthIndex: number, startDay: number) => {
    const daysInMonth = getDaysCountInMonth(monthIndex)
    const secondDay = startDay + 14
    if (secondDay > daysInMonth) {
      return [startDay, startDay + 14 - daysInMonth]
    }
    return [startDay, secondDay]
  }

  const getFullWeeksInMonth = (monthIndex: number) => {
    return Math.floor(getDaysCountInMonth(monthIndex) / 7)
  }

  const calculateDailyExpense = (dailySubscriptions: Subscription[], day: number, monthIndex: number) => {
    return dailySubscriptions.reduce((total, sub) => {
      const startMonth = sub.startingMonth || 0
      if (monthIndex < startMonth) return total

      const isFortnightlyDay = sub.recurringType === 'fortnightly'
      const [firstDay, secondDay] = isFortnightlyDay ? getFortnightlyDays(monthIndex, sub.dayOfMonth) : [day, day]

      if (sub.dayOfMonth === firstDay || sub.dayOfMonth === secondDay) {
        if (sub.recurringType === 'weekly') {
          return total + sub.cost * getFullWeeksInMonth(monthIndex)
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

  const calculateMonthlyTotal = (monthIndex: number) => {
    let total = 0
    const daysInMonth = getDaysCountInMonth(monthIndex)
    for (let day = 1; day <= daysInMonth; day++) {
      total += calculateDailyExpense(getDaySubscriptions(day, monthIndex), day, monthIndex)
      console.log({ monthIndex, day, total })
    }
    return total
  }

  const getSubscriptionsForMonth = (monthIndex: number) => {
    return subscriptions.filter((sub) => {
      const startMonth = sub.startingMonth || 0
      return monthIndex >= startMonth
    })
  }

  const formatSubscriptions = (subs: Subscription[]) => {
    if (subs.length === 0) return ''
    if (subs.length <= 2) return subs.map((sub) => sub.title).join(', ')
    return `${subs[0].title}, ${subs[1].title}, +${subs.length - 2} more`
  }

  const getDaySubscriptions = (day: number, monthIndex: number) => {
    return subscriptions.filter((sub) => {
      if (sub.recurringType === 'yearly') {
        return sub.startingMonth === monthIndex && day === sub.dayOfMonth
      }
      if (sub.recurringType === 'fortnightly') {
        const [startDay, endDay] = getFortnightlyDays(monthIndex, sub.dayOfMonth)
        return day === startDay || day === endDay
      }
      return sub.dayOfMonth === day
    })
  }

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

  const totalYearlySum = months.reduce((sum, _, index) => sum + calculateMonthlyTotal(index), 0)

  const renderMonthlyView = () => {
    const daysInMonth = getDaysCountInMonth(currentMonth)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const monthlyTotal = calculateMonthlyTotal(currentMonth)

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-bold p-2">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2"></div>
        ))}
        {days.map((day) => {
          const isToday = currentMonth === today.getMonth() && day === today.getDate()
          const daySubscriptions = getDaySubscriptions(day, currentMonth)
          const hasSubscriptions = daySubscriptions.length > 0
          const dayTotal = hasSubscriptions ? calculateDailyExpense(daySubscriptions, day, currentMonth) : 0
          const hasSubscriptionsAndExpenses = hasSubscriptions // && dayTotal > 0
          return (
            <motion.div
              key={day}
              className={`border p-2 h-24 overflow-y-auto ${isToday ? 'bg-secondary text-secondary-foreground' : ''}`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="font-bold">{day}</div>
              {hasSubscriptionsAndExpenses && <div className="text-sm">{formatCurrency(dayTotal, currency)}</div>}
              {hasSubscriptionsAndExpenses && <div className="text-xs">{formatSubscriptions(daySubscriptions)}</div>}
            </motion.div>
          )
        })}
        <div className="col-span-7 text-right p-2 font-bold">Total: {formatCurrency(monthlyTotal, currency)}</div>
      </div>
    )
  }

  const renderYearlyView = () => {
    return (
      <div className="grid grid-cols-3 gap-4">
        {months.map((month, index) => {
          const isCurrentMonth = index === today.getMonth()
          const monthlyTotal = calculateMonthlyTotal(index)
          const monthSubscriptions = getSubscriptionsForMonth(index)
          return (
            <motion.div
              key={month}
              className={`border p-4 ${isCurrentMonth ? 'bg-secondary text-secondary-foreground' : ''}`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="font-bold">{month}</div>
              <div className="text-lg">{formatCurrency(monthlyTotal, currency)}</div>
              <div className="text-sm">{formatSubscriptions(monthSubscriptions)}</div>
            </motion.div>
          )
        })}
        <div className="col-span-3 text-right p-2 font-bold">Total: {formatCurrency(totalYearlySum, currency)}</div>
      </div>
    )
  }

  const cardContent = (
    <div>
      {isMonthlyView && (
        <div className="mb-4 flex justify-between items-center">
          <Button variant="outline" onClick={() => setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))}>
            Previous
          </Button>
          <h3 className="text-lg font-medium">
            {months[currentMonth]} {currentYear}
          </h3>
          <Button variant="outline" onClick={() => setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))}>
            Next
          </Button>
        </div>
      )}
      {isMonthlyView ? renderMonthlyView() : renderYearlyView()}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>Expense Calendar</div>
          <div className="space-x-2 text-base">
            <Button variant={isMonthlyView ? 'default' : 'outline'} onClick={() => setIsMonthlyView(true)}>
              Monthly
            </Button>
            <Button variant={!isMonthlyView ? 'default' : 'outline'} onClick={() => setIsMonthlyView(false)}>
              Yearly
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {subscriptions.length === 0 ? (
          <p>Add some subscriptions to see your expenses in a calendar view.</p>
        ) : (
          cardContent
        )}
      </CardContent>
    </Card>
  )
}
