'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { calculateCategorySums, calculateMonthlyTotal, calculateYearlyTotal } from '@/lib/calc'
import { formatCurrency } from '@/lib/utils'
import type { Subscription } from '@/models/schema'
import { useState } from 'react'
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type ExpenseChartsProps = {
  subscriptions: Subscription[]
  currency: string
}

export default function ExpenseCharts({ subscriptions = [], currency }: ExpenseChartsProps) {
  const [activeTab, setActiveTab] = useState('pie')
  const currentYear = new Date().getFullYear()

  const totalYearlyCost = calculateYearlyTotal(subscriptions, currentYear)

  const pieChartData = calculateCategorySums(subscriptions, currentYear)

  const barChartData = Array.from({ length: 12 }, (_, index) => ({
    name: new Date(currentYear, index).toLocaleString('default', { month: 'short' }),
    cost: calculateMonthlyTotal(subscriptions, index, currentYear),
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {pieChartData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(value as number, currency)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barChartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => formatCurrency(value as number, currency)} />
        <Legend />
        <Bar dataKey="cost" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Expense Charts</CardTitle>
        <CardDescription>Visualize your expenses</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {subscriptions.length === 0 ? (
          <p>Add some subscriptions to see your expense charts.</p>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              </TabsList>
              <TabsContent value="pie" className="flex-grow">
                {renderPieChart()}
              </TabsContent>
              <TabsContent value="bar" className="flex-grow">
                {renderBarChart()}
              </TabsContent>
            </Tabs>
            <p className="mt-4 text-center font-medium">
              Total Yearly Cost: {formatCurrency(totalYearlyCost, currency)}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
