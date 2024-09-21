'use client'

import { deleteUser, updateUserSettings } from '@/app/actions/user'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { parseCurrency } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SettingsForm({
  initialCurrency,
  initialMonthlyIncome,
  initialMonthlyBudget,
}: {
  initialCurrency: string
  initialMonthlyIncome?: number
  initialMonthlyBudget?: number
}) {
  const [currency, setCurrency] = useState(initialCurrency)
  const [monthlyIncome, setMonthlyIncome] = useState(
    initialMonthlyIncome ? (initialMonthlyIncome / 100).toFixed(2) : '0.00',
  )
  const [monthlyBudget, setMonthlyBudget] = useState(
    initialMonthlyBudget ? (initialMonthlyBudget / 100).toFixed(2) : '0.00',
  )
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUserSettings({
        currency,
        monthlyIncome: parseCurrency(monthlyIncome) * 100, // Convert to cents
        monthlyBudget: parseCurrency(monthlyBudget) * 100, // Convert to cents
      })
      toast({
        title: 'Settings updated',
        description: 'Your settings have been successfully saved.',
      })
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteAccount = async () => {
    await deleteUser()
    router.push('/') // Redirect to home page after account deletion
  }

  const currencies = Intl.supportedValuesOf('currency')

  return (
    <div className="flex flex-col gap-4 w-[500px] max-w-full">
      <Card className="max-w-lg">
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
                step="0.01"
                min="0"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="monthlyBudget">Monthly Budget (Optional)</Label>
              <Input
                id="monthlyBudget"
                type="number"
                step="0.01"
                min="0"
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

      <div className="flex justify-start">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="link" size="sm" className="border-destructive text-sm text-muted-foreground">
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount}>Delete Account</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
