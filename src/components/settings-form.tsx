'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

export default function SettingsForm() {
  const [currency, setCurrency] = useState('USD')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [monthlyBudget, setMonthlyBudget] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement settings update logic here
  }

  const currencies = Intl.supportedValuesOf('currency')

  return (
    <div className="flex flex-col gap-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="monthlyIncome">Monthly Income (Optional)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="monthlyBudget">Monthly Budget (Optional)</Label>
              <Input
                id="monthlyBudget"
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" onClick={handleSubmit}>
            Save Settings
          </Button>
        </CardFooter>
      </Card>

      <div>
        <Button variant="link" size="sm" className="border-destructive text-sm text-muted-foreground">
          Delete Account
        </Button>
      </div>
    </div>
  )
}
