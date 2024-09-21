'use client'

import { deleteTransaction, updateTransaction } from '@/app/actions/transactions'
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { capitalizeFirstLetter, parseCurrency } from '@/lib/utils'
import { expenseCategories, type Transaction } from '@/models/schema'
import { useEffect, useState } from 'react'

type EditExpenseDialogProps = {
  subscription: Transaction
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditExpenseDialog({ subscription, open, onOpenChange }: EditExpenseDialogProps) {
  const [title, setTitle] = useState(subscription.title)
  const [cost, setCost] = useState((subscription.amount / 100).toFixed(2))
  const [dayOfMonth, setDayOfMonth] = useState(subscription.monthlyDay.toString())
  const [recurringType, setRecurringType] = useState(subscription.recurringType)
  const [category, setCategory] = useState(subscription.category)
  const [customRecurringMonths, setCustomRecurringMonths] = useState(
    subscription.monthlyCustomRecurringMonths?.toString() || '',
  )
  const [startingMonth, setStartingMonth] = useState(subscription.startingMonth.toString())

  useEffect(() => {
    setTitle(subscription.title)
    setCost((subscription.amount / 100).toFixed(2))
    setDayOfMonth(subscription.monthlyDay.toString())
    setRecurringType(subscription.recurringType)
    setCategory(subscription.category)
    setCustomRecurringMonths(subscription.monthlyCustomRecurringMonths?.toString() || '')
    setStartingMonth(subscription.startingMonth.toString())
  }, [subscription])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('id', subscription.id.toString())
    formData.append('title', title)
    formData.append('cost', (parseCurrency(cost) * 100).toString()) // Convert to cents
    formData.append('category', category)
    formData.append('dayOfMonth', dayOfMonth)
    formData.append('recurringType', recurringType)
    formData.append('customRecurringMonths', customRecurringMonths)
    formData.append('startingMonth', startingMonth)

    await updateTransaction(formData)
    onOpenChange(false)
  }

  const handleDelete = async () => {
    await deleteTransaction(subscription.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {capitalizeFirstLetter(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              min="0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="dayOfMonth">Day of Month</Label>
            <Input
              id="dayOfMonth"
              type="number"
              min="1"
              max="31"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="recurringType">Recurring Type</Label>
            <Select value={recurringType} onValueChange={(value) => setRecurringType(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select recurring type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="fortnightly">Fortnightly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {recurringType === 'custom' && (
            <div>
              <Label htmlFor="customRecurringMonths">Custom Recurring Months</Label>
              <Input
                id="customRecurringMonths"
                type="number"
                value={customRecurringMonths}
                onChange={(e) => setCustomRecurringMonths(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <Label htmlFor="startingMonth">Starting Month</Label>
            <Select value={startingMonth} onValueChange={setStartingMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select starting month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" className="mr-auto">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the expense data from all calculations.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
