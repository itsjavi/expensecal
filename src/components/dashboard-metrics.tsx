'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSelectedDate } from '@/contexts/selected-date-context'
import {
  calculateCurrentMonthExpenses,
  calculatePotentialYearlySavings,
  calculateRemainingBudget,
  calculateYearlyTotal,
} from '@/lib/calc'
import { cn, formatCurrency } from '@/lib/utils'
import { type Transaction } from '@/models/schema'
import { motion, useSpring, useTransform } from 'framer-motion'
import { CoinsIcon, PiggyBankIcon, TargetIcon, TrendingUpIcon, WalletIcon } from 'lucide-react'
import { useEffect } from 'react'

type DashboardMetricsProps = {
  subscriptions: Transaction[]
  currency: string
  monthlyIncome?: number
  monthlyBudget?: number
  savingsGoal?: number
  initialSavings?: number
}

function AnimatedNumber({ value, currency }: { value: number; currency?: string }) {
  const springValue = useSpring(value, { stiffness: 175, damping: 25 }) // Adjusted values for 75% faster animation
  const display = useTransform(springValue, (current) =>
    currency ? formatCurrency(current, currency) : current.toFixed(0),
  )

  useEffect(() => {
    springValue.set(value)
  }, [value, springValue])

  return <motion.span>{display}</motion.span>
}

function DashboardMetricsCard({
  children,
  subtitle,
  value,
  valuePrefix,
  valueSuffix,
  icon: Icon,
  currency,
  className,
}: {
  children: React.ReactNode
  subtitle?: string
  value: number
  valuePrefix?: string
  valueSuffix?: string
  icon: React.ElementType
  currency?: string
  className?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-center md:justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">{children}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('text-lg sm:text-2xl font-bold flex items-center flex-col md:flex-row', className)}>
          <Icon className="mr-2 h-[3cap] w-[3cap] md:w-[1cap] md:h-[1cap] min-h-[20px] min-w-[20px]" />
          <div className="">
            {valuePrefix && <span className="mr-1 text-base">{valuePrefix}</span>}
            <AnimatedNumber value={value} currency={currency} />
            {valueSuffix && <span className="ml-1 text-base">{valueSuffix}</span>}
          </div>
        </div>
        {subtitle && (
          <div className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">{subtitle}</div>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardMetrics({
  subscriptions,
  currency,
  monthlyIncome = 0,
  monthlyBudget = 0,
  savingsGoal = 0,
  initialSavings = 0,
}: DashboardMetricsProps) {
  const { selectedDate } = useSelectedDate()
  const currentDate = new Date()

  const selectedYear = selectedDate.getFullYear()
  const selectedMonth = selectedDate.getMonth()

  const currentMonthExpenses = calculateCurrentMonthExpenses(subscriptions, selectedYear, selectedMonth)
  const yearlyExpenses = calculateYearlyTotal(subscriptions, selectedYear)
  const remainingBudget = calculateRemainingBudget(monthlyBudget, currentMonthExpenses)
  const potentialYearlySavings = calculatePotentialYearlySavings(monthlyIncome, yearlyExpenses)

  const yearlyIncome = monthlyIncome * 12
  const currentMonthExpensePercentage = monthlyIncome > 0 ? (currentMonthExpenses / monthlyIncome) * 100 : 0
  const yearlyExpensePercentage = yearlyIncome > 0 ? (yearlyExpenses / yearlyIncome) * 100 : 0
  const savingsPercentage = yearlyIncome > 0 ? (potentialYearlySavings / yearlyIncome) * 100 : 0

  // Calculate accumulated savings
  const monthsDiff = (selectedYear - currentDate.getFullYear()) * 12 + (selectedMonth - currentDate.getMonth())
  const accumulatedSavings = initialSavings + (potentialYearlySavings / 12) * monthsDiff

  // Recalculate time to reach savings goal
  const remainingSavingsGoal = Math.max(savingsGoal - accumulatedSavings, 0)
  const monthsToReachGoal = remainingSavingsGoal / (potentialYearlySavings / 12)
  const yearsToReachGoal = Math.max(monthsToReachGoal / 12, 0)

  const getRemainingBudgetColor = (remaining: number) => {
    if (remaining < 0) return 'text-red-500'
    if (remaining < monthlyBudget * 0.2) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getSavingsColor = (savings: number) => {
    const yearlyIncome = monthlyIncome * 12
    const savingsPercentage = (savings / yearlyIncome) * 100
    if (savingsPercentage > 50) return 'text-green-500'
    if (savingsPercentage >= 10) return 'text-yellow-500'
    return 'text-red-500'
  }

  // const totalPotentialSavings = initialSavings + potentialYearlySavings

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
      <DashboardMetricsCard
        className="text-blue-500"
        currency={currency}
        icon={CoinsIcon}
        value={currentMonthExpenses}
        subtitle={`${currentMonthExpensePercentage.toFixed(1)}% of monthly income`}
      >
        Current <span className="hidden md:inline">Monthly</span> Expenses
      </DashboardMetricsCard>
      <DashboardMetricsCard
        className={getRemainingBudgetColor(remainingBudget)}
        currency={currency}
        icon={WalletIcon}
        value={remainingBudget}
        subtitle={`of ${formatCurrency(monthlyBudget, currency)}`}
      >
        Remaining Budget
      </DashboardMetricsCard>
      <DashboardMetricsCard
        className="text-blue-500"
        currency={currency}
        icon={CoinsIcon}
        value={yearlyExpenses}
        subtitle={`${yearlyExpensePercentage.toFixed(1)}% of yearly income`}
      >
        Yearly Expenses
      </DashboardMetricsCard>
      <DashboardMetricsCard
        className={getSavingsColor(potentialYearlySavings)}
        currency={currency}
        icon={PiggyBankIcon}
        value={potentialYearlySavings}
        subtitle={`${savingsPercentage.toFixed(1)}% of yearly income`}
      >
        Potential <span className="hidden md:inline">Yearly</span> Savings
      </DashboardMetricsCard>
      <DashboardMetricsCard
        className="text-pink-500"
        currency={currency}
        icon={TrendingUpIcon}
        value={accumulatedSavings}
        subtitle={`Initial: ${formatCurrency(initialSavings, currency)}`}
      >
        <span className="hidden md:inline">Estimated</span> Accumulated Savings
      </DashboardMetricsCard>
      <DashboardMetricsCard
        className="text-pink-500"
        currency=""
        icon={TargetIcon}
        value={yearsToReachGoal < 1 ? Math.max(Math.ceil(monthsToReachGoal), 0) : Math.ceil(yearsToReachGoal)}
        valueSuffix={yearsToReachGoal < 1 ? 'months' : 'years'}
        subtitle={`to ${formatCurrency(savingsGoal, currency)}`}
      >
        Time to Reach Savings Goal
      </DashboardMetricsCard>
    </div>
  )
}
