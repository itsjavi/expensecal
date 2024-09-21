'use client'

import { addSubscription } from '@/app/actions/subscriptions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { capitalizeFirstLetter } from '@/lib/utils'
import { expenseCategories } from '@/models/schema'
import { useState } from 'react'

type AddExpenseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddExpenseDialog({ open, onOpenChange }: AddExpenseDialogProps) {
  const [title, setTitle] = useState('')
  const [cost, setCost] = useState('100')
  const [dayOfMonth, setDayOfMonth] = useState('1')
  const [recurringType, setRecurringType] = useState('monthly')
  const [category, setCategory] = useState('subscriptions')
  const [customRecurringMonths, setCustomRecurringMonths] = useState('')
  const [startingMonth, setStartingMonth] = useState('0')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('cost', cost)
    formData.append('category', category)
    formData.append('dayOfMonth', dayOfMonth)
    formData.append('recurringType', recurringType)
    formData.append('customRecurringMonths', customRecurringMonths)
    formData.append('startingMonth', startingMonth)

    await addSubscription(formData)
    onOpenChange(false)
    // Reset form fields
    setTitle('')
    setCost('100')
    setCategory('subscriptions')
    setDayOfMonth('1')
    setRecurringType('monthly')
    setCustomRecurringMonths('')
    setStartingMonth('0')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
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
            <Input id="cost" type="number" value={cost} onChange={(e) => setCost(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="dayOfMonth">Day of Month</Label>
            <Input
              id="dayOfMonth"
              type="number"
              min="1"
              max="31"
              defaultValue="1"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="recurringType">Recurring Type</Label>
            <Select value={recurringType} onValueChange={setRecurringType}>
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
            <Button type="submit">Add Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
