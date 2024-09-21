'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  calculateDailyExpense,
  calculateMonthlyTotal,
  calculateYearlyTotal,
  getDaySubscriptions,
  getDaysCountInMonth,
  getSubscriptionsForMonth,
} from '@/lib/calc'
import { cn, formatCurrency } from '@/lib/utils'
import { type Subscription } from '@/models/schema'
import { motion } from 'framer-motion'
import { useState } from 'react'

type ExpenseCalendarProps = {
  subscriptions: Subscription[]
  currency: string
}

export default function ExpenseCalendar({ subscriptions = [], currency }: ExpenseCalendarProps) {
  const allCategory = 'All Categories'
  const [isMonthlyView, setIsMonthlyView] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState(allCategory)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const today = new Date()
  const minYear = today.getFullYear() - 1

  const formatSubscriptions = (subs: Subscription[]) => {
    if (subs.length === 0) return ''
    if (subs.length <= 2) return subs.map((sub) => sub.title).join(', ')
    return `${subs[0].title}, ${subs[1].title}, +${subs.length - 2} more`
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

  const categories = [allCategory, ...new Set(subscriptions.map((sub) => sub.category))]

  const filteredSubscriptions =
    selectedCategory === allCategory ? subscriptions : subscriptions.filter((sub) => sub.category === selectedCategory)

  const totalYearlySum = calculateYearlyTotal(filteredSubscriptions, currentDate.getFullYear())

  const isPreviousDisabled = () => {
    if (isMonthlyView) {
      return currentDate.getFullYear() === minYear && currentDate.getMonth() === 0
    } else {
      return currentDate.getFullYear() === minYear
    }
  }

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() - 1)
      if (newDate.getFullYear() < minYear) {
        newDate.setFullYear(minYear)
        newDate.setMonth(0)
      }
      return newDate
    })
  }

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  const handlePreviousYear = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      const newYear = Math.max(newDate.getFullYear() - 1, minYear)
      newDate.setFullYear(newYear)
      return newDate
    })
  }

  const handleNextYear = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setFullYear(newDate.getFullYear() + 1)
      return newDate
    })
  }

  const handleMonthClick = (monthIndex: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(monthIndex)
      return newDate
    })
    setIsMonthlyView(true)
  }

  const renderMonthlyView = () => {
    const daysInMonth = getDaysCountInMonth(currentDate.getFullYear(), currentDate.getMonth())
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const monthlyTotal = calculateMonthlyTotal(filteredSubscriptions, currentDate.getMonth(), currentDate.getFullYear())

    return (
      <>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-bold p-2">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="p-2"></div>
          ))}
          {days.map((day) => {
            const isToday = currentDate.getMonth() === today.getMonth() && day === today.getDate()
            const daySubscriptions = getDaySubscriptions(filteredSubscriptions, day, currentDate.getMonth(), currentDate.getFullYear())
            const hasSubscriptions = daySubscriptions.length > 0
            const dayTotal = hasSubscriptions
              ? calculateDailyExpense(daySubscriptions, day, currentDate.getMonth(), currentDate.getFullYear())
              : 0
            const hasSubscriptionsAndExpenses = hasSubscriptions
            const cellClasses = cn(
              'border p-2 h-24 overflow-y-auto rounded-md',
              isToday
                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50'
                : 'bg-neutral-50 dark:bg-neutral-900',
            )
            return (
              <motion.div
                key={day}
                className={cn(cellClasses, selectedDay === day && 'ring-2 ring-primary')}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => setSelectedDay(selectedDay === day ? null : day)}
              >
                <div className="font-bold text-muted-foreground">{day}</div>
                {hasSubscriptionsAndExpenses && (
                  <div className="text-base text-blue-500 dark:text-blue-400">{formatCurrency(dayTotal, currency)}</div>
                )}
                {hasSubscriptionsAndExpenses && <div className="text-xs">{formatSubscriptions(daySubscriptions)}</div>}
              </motion.div>
            )
          })}
        </div>
        {selectedDay ? (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">
              Expenses for {months[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()}
            </h4>
            <ScrollArea className="mt-4 pr-4">
              {getDaySubscriptions(filteredSubscriptions, selectedDay, currentDate.getMonth()).length === 0 ? (
                <p>No expenses for this day.</p>
              ) : (
                <ul className="space-y-4">
                  {getDaySubscriptions(filteredSubscriptions, selectedDay, currentDate.getMonth()).map((sub) => (
                    <li key={sub.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <h3 className="font-medium">{sub.title}</h3>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(sub.cost, currency)} / {sub.recurringType}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </div>
        ) : (
          <div className="col-span-7 text-right p-2 font-bold mt-4">
            Total: {formatCurrency(monthlyTotal, currency)}
          </div>
        )}
      </>
    )
  }

  const renderYearlyView = () => {
    return (
      <div className="grid grid-cols-3 gap-4">
        {months.map((month, index) => {
          const isCurrentMonth = index === today.getMonth() && currentDate.getFullYear() === today.getFullYear()
          const monthlyTotal = calculateMonthlyTotal(filteredSubscriptions, index, currentDate.getFullYear())
          const monthSubscriptions = getSubscriptionsForMonth(filteredSubscriptions, index)
          const cellClasses = cn(
            'border p-4 overflow-y-auto rounded-md cursor-pointer',
            isCurrentMonth
              ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50'
              : 'bg-neutral-50 dark:bg-neutral-900',
          )
          return (
            <motion.div
              key={month}
              className={cellClasses}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => handleMonthClick(index)}
            >
              <div className="font-bold">{month}</div>
              <span className="text-lg text-blue-500 dark:text-blue-400">{formatCurrency(monthlyTotal, currency)}</span>
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
      {isMonthlyView ? (
        <div className="mb-4 flex justify-between items-center">
          <Button variant="outline" onClick={handlePreviousMonth} disabled={isPreviousDisabled()}>
            Previous
          </Button>
          <h3 className="text-lg font-medium">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <Button variant="outline" onClick={handleNextMonth}>
            Next
          </Button>
        </div>
      ) : (
        <div className="mb-4 flex justify-between items-center">
          <Button variant="outline" onClick={handlePreviousYear} disabled={isPreviousDisabled()}>
            Previous
          </Button>
          <h3 className="text-lg font-medium">{currentDate.getFullYear()}</h3>
          <Button variant="outline" onClick={handleNextYear}>
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
        <CardTitle className="flex justify-between items-start">
          <div>Expense Calendar</div>
          <div className="flex items-center space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-x-2 text-base">
              <Button variant={isMonthlyView ? 'default' : 'outline'} onClick={() => setIsMonthlyView(true)}>
                Monthly
              </Button>
              <Button variant={!isMonthlyView ? 'default' : 'outline'} onClick={() => setIsMonthlyView(false)}>
                Yearly
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredSubscriptions.length === 0 ? <p>No subscriptions found for the selected category.</p> : cardContent}
      </CardContent>
    </Card>
  )
}
