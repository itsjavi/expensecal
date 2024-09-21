'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  calculateDailyExpense,
  calculateMonthlyTotal,
  calculateYearlyTotal,
  getDaySubscriptions,
  getDaysCountInMonth,
  getExpensesForMonth,
} from '@/lib/calc'
import { cn, formatCurrency } from '@/lib/utils'
import { type Transaction } from '@/models/schema'
import { motion, AnimatePresence } from 'framer-motion'
import { DownloadIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { DotIndicator } from './ui/dot-indicator'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'

const ANIMATION_DURATION = 0.2

type ExpenseCalendarProps = {
  subscriptions: Transaction[]
  currency: string
}

function ExportButton({ href, label }: { href: string; label: string }) {
  return (
    <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
      <a href={href} download>
        <DownloadIcon className="h-4 w-4 mr-2" />
        {label}
      </a>
    </Button>
  )
}

export default function ExpenseCalendar({ subscriptions = [], currency }: ExpenseCalendarProps) {
  const allCategory = 'All Categories'
  const [isMonthlyView, setIsMonthlyView] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState(allCategory)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const today = new Date()
  const minYear = today.getFullYear() - 1

  const formatSubscriptions = (subs: Transaction[]) => {
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

  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  }

  const [slideDirection, setSlideDirection] = useState(0)

  const handlePreviousMonth = () => {
    setSlideDirection(-1)
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
    setSlideDirection(1)
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  const handlePreviousYear = () => {
    setSlideDirection(-1)
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      const newYear = Math.max(newDate.getFullYear() - 1, minYear)
      newDate.setFullYear(newYear)
      return newDate
    })
  }

  const handleNextYear = () => {
    setSlideDirection(1)
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
      <AnimatePresence mode="wait" custom={slideDirection}>
        <motion.div
          key={currentDate.toISOString()}
          custom={slideDirection}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', duration: ANIMATION_DURATION }}
        >
          <div className="grid grid-cols-7 gap-2 auto-rows-fr">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-bold p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 auto-rows-fr">
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`}></div>
            ))}
            {days.map((day) => {
              const isToday = currentDate.getMonth() === today.getMonth() && day === today.getDate()
              const daySubscriptions = getDaySubscriptions(
                filteredSubscriptions,
                day,
                currentDate.getMonth(),
                currentDate.getFullYear(),
              )
              const hasSubscriptions = daySubscriptions.length > 0
              const dayTotal = hasSubscriptions
                ? calculateDailyExpense(daySubscriptions, day, currentDate.getMonth(), currentDate.getFullYear())
                : 0
              const hasSubscriptionsAndExpenses = hasSubscriptions
              const cellClasses = cn(
                'border p-2 rounded-md flex flex-col justify-start h-full gap-1 items-center md:items-start text-left',
                isToday
                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50'
                  : 'bg-neutral-50 dark:bg-neutral-900',
              )

              const mobileLabel = hasSubscriptionsAndExpenses
                ? daySubscriptions.length > 9
                  ? '+9'
                  : daySubscriptions.length
                : null

              // Sort subscriptions to prioritize those with logos
              const sortedSubscriptions = [...daySubscriptions].sort((a, b) => {
                if (a.logo && !b.logo) return -1
                if (!a.logo && b.logo) return 1
                return 0
              })

              const displayedSubscriptions = sortedSubscriptions.slice(0, 4)
              const remainingCount = daySubscriptions.length - displayedSubscriptions.length

              return (
                <motion.button
                  key={day}
                  className={cn(cellClasses, selectedDay === day && 'ring-2 ring-primary')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                >
                  <span className="block font-bold text-muted-foreground">{day}</span>
                  <span className="flex flex-col gap-1 overflow-hidden">
                    {hasSubscriptionsAndExpenses && (
                      <span className="text-base text-blue-500 dark:text-blue-400 hidden md:block">
                        {formatCurrency(dayTotal, currency)}
                      </span>
                    )}
                    {mobileLabel && (
                      <DotIndicator className="inline-flex md:hidden bg-blue-300 text-black font-bold">
                        {mobileLabel}
                      </DotIndicator>
                    )}
                    <span className="flex-col gap-1 hidden md:flex">
                      <span className="flex items-center gap-1">
                        {displayedSubscriptions.map((sub, index) =>
                          sub.logo ? (
                            <Image
                              key={index}
                              src={sub.logo}
                              alt={sub.title}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <span key={index} className="text-xs truncate">
                              {sub.title}
                            </span>
                          ),
                        )}
                      </span>
                      {remainingCount > 0 && (
                        <span className="text-xs text-muted-foreground">+{remainingCount} more</span>
                      )}
                    </span>
                  </span>
                </motion.button>
              )
            })}
          </div>
          {selectedDay ? (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">
                Expenses for {months[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()}
              </h4>
              <ScrollArea className="mt-4">
                {getDaySubscriptions(
                  filteredSubscriptions,
                  selectedDay,
                  currentDate.getMonth(),
                  currentDate.getFullYear(),
                ).length === 0 ? (
                  <p>No expenses for this day.</p>
                ) : (
                  <ul className="space-y-4">
                    {getDaySubscriptions(
                      filteredSubscriptions,
                      selectedDay,
                      currentDate.getMonth(),
                      currentDate.getFullYear(),
                    ).map((sub) => (
                      <li key={sub.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <div className="flex items-center space-x-4 font-medium">
                            {sub.logo && (
                              <Image src={sub.logo} alt={sub.title} width={32} height={32} className="rounded-full" />
                            )}
                            <div>
                              <div className="font-medium">{sub.title}</div>
                              <div className="text-sm text-gray-500">
                                {formatCurrency(sub.amount, currency)} / {sub.recurringType}
                              </div>
                            </div>
                          </div>
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
        </motion.div>
      </AnimatePresence>
    )
  }

  const renderYearlyView = () => {
    return (
      <AnimatePresence mode="wait" custom={slideDirection}>
        <motion.div
          key={currentDate.getFullYear()}
          custom={slideDirection}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', duration: ANIMATION_DURATION }}
        >
          <div className="grid grid-cols-3 gap-4">
            {months.map((month, index) => {
              const isCurrentMonth = index === today.getMonth() && currentDate.getFullYear() === today.getFullYear()
              const monthlyTotal = calculateMonthlyTotal(filteredSubscriptions, index, currentDate.getFullYear())
              const monthSubscriptions = getExpensesForMonth(filteredSubscriptions, index)
              const cellClasses = cn(
                'border p-2 rounded-md flex flex-col justify-between h-full gap-1 items-center md:items-start text-left',
                isCurrentMonth
                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50'
                  : 'bg-neutral-50 dark:bg-neutral-900',
              )
              return (
                <motion.button
                  key={month}
                  className={cellClasses}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  onClick={() => handleMonthClick(index)}
                >
                  <div className="font-bold">
                    <span className="hidden md:inline">{months[index]}</span>
                    <span className="inline md:hidden">{monthsShort[index]}</span>
                  </div>
                  <span className="text-sm md:text-lg text-blue-500 dark:text-blue-400">
                    {formatCurrency(monthlyTotal, currency)}
                  </span>
                  <div className="text-xs md:text-sm">{formatSubscriptions(monthSubscriptions)}</div>
                </motion.button>
              )
            })}
            <div className="col-span-3 text-right p-2 font-bold">Total: {formatCurrency(totalYearlySum, currency)}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  const cardContent = (
    <div className="overflow-hidden">
      {isMonthlyView ? (
        <div className="mb-4 grid grid-cols-3 justify-between items-center">
          <div className="col-span-1">
            <Button variant="outline" onClick={handlePreviousMonth} disabled={isPreviousDisabled()}>
              Previous
            </Button>
          </div>
          <div className="col-span-1 text-center">
            <div className="text-base md:text-lg font-medium">
              <span className="hidden md:inline">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <span className="inline md:hidden">
                {monthsShort[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
            </div>
          </div>
          <div className="col-span-1 text-right">
            <Button variant="outline" onClick={handleNextMonth}>
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-4 grid grid-cols-3 justify-between items-center">
          <div className="col-span-1">
            <Button variant="outline" onClick={handlePreviousYear} disabled={isPreviousDisabled()}>
              Previous
            </Button>
          </div>
          <div className="col-span-1 text-center">
            <div className="text-lg font-medium">{currentDate.getFullYear()}</div>
          </div>
          <div className="col-span-1 text-right">
            <Button variant="outline" onClick={handleNextYear}>
              Next
            </Button>
          </div>
        </div>
      )}
      {isMonthlyView ? renderMonthlyView() : renderYearlyView()}
    </div>
  )

  const hasNoExpenses = subscriptions.length === 0
  const hasFilteredExpenses = filteredSubscriptions.length > 0
  const hasExpensesButNoFilteredExpenses = !hasNoExpenses && !hasFilteredExpenses

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-4 justify-between items-start flex-col md:flex-row">
          <div>Expense Calendar</div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px] md:w-[180px]">
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
            <ToggleGroup
              type="single"
              size="sm"
              value={isMonthlyView ? 'monthly' : 'yearly'}
              onValueChange={(value) => setIsMonthlyView(value === 'monthly')}
            >
              <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
              <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasNoExpenses ? <p>Add some expenses to see your expense calendar.</p> : ''}
        {hasExpensesButNoFilteredExpenses ? <p>No expenses found for the selected category.</p> : ''}
        {hasFilteredExpenses && cardContent}
      </CardContent>
      <CardFooter>
        <ExportButton
          href={`/api/export/${isMonthlyView ? 'monthly' : 'yearly'}?year=${currentDate.getFullYear()}${isMonthlyView ? `&month=${currentDate.getMonth()}` : ''}`}
          label={`Export Expenses for the current ${isMonthlyView ? 'Month' : 'Year'}`}
        />
      </CardFooter>
    </Card>
  )
}
