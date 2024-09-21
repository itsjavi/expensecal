'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  calculateCurrentMonthExpenses,
  calculatePotentialYearlySavings,
  calculateRemainingBudget,
  calculateYearlyTotal,
} from '@/lib/calc'
import { cn, formatCurrency } from '@/lib/utils'
import { type Subscription } from '@/models/schema'
import { CoinsIcon, PiggyBankIcon, WalletIcon } from 'lucide-react'

type DashboardMetricsProps = {
  subscriptions: Subscription[]
  currency: string
  monthlyIncome?: number
  monthlyBudget?: number
}

function DashboardMetricsCard({
  children,
  subtitle,
  value,
  icon: Icon,
  currency,
  className,
}: {
  children: React.ReactNode
  subtitle?: string
  value: number
  icon: React.ElementType
  currency: string
  className?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-center md:justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">{children}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'text-lg sm:text-2xl font-bold text-blue-500 flex items-center flex-col md:flex-row',
            className,
          )}
        >
          <Icon className="mr-2 h-[3cap] w-[3cap] md:w-[1cap] md:h-[1cap] min-h-[20px] min-w-[20px]" />
          {formatCurrency(value, currency)}
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
}: DashboardMetricsProps) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  const currentMonthExpenses = calculateCurrentMonthExpenses(subscriptions, currentYear, currentMonth)
  const yearlyExpenses = calculateYearlyTotal(subscriptions, currentYear)
  const remainingBudget = calculateRemainingBudget(monthlyBudget, currentMonthExpenses)
  const potentialYearlySavings = calculatePotentialYearlySavings(monthlyIncome, yearlyExpenses)

  const yearlyIncome = monthlyIncome * 12
  const savingsPercentage = (potentialYearlySavings / yearlyIncome) * 100
  const currentMonthExpensePercentage = (currentMonthExpenses / monthlyIncome) * 100
  const yearlyExpensePercentage = (yearlyExpenses / yearlyIncome) * 100

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

  return (
    <div className="grid grid-cols-2 gap-4">
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
    </div>
  )
}
