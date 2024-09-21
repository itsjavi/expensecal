'use client'

import { deleteSubscription, updateSubscription } from '@/app/actions/subscriptions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type Subscription } from '@/models/schema'
import { useEffect, useState } from 'react'

type EditExpenseDialogProps = {
  subscription: Subscription
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditExpenseDialog({ subscription, open, onOpenChange }: EditExpenseDialogProps) {
  const [title, setTitle] = useState(subscription.title)
  const [cost, setCost] = useState(subscription.cost.toString())
  const [dayOfMonth, setDayOfMonth] = useState(subscription.dayOfMonth.toString())
  const [recurringType, setRecurringType] = useState(subscription.recurringType)
  const [category, setCategory] = useState(subscription.category)
  const [customRecurringMonths, setCustomRecurringMonths] = useState(
    subscription.customRecurringMonths?.toString() || '',
  )
  const [startingMonth, setStartingMonth] = useState(subscription.startingMonth.toString())

  useEffect(() => {
    setTitle(subscription.title)
    setCost(subscription.cost.toString())
    setDayOfMonth(subscription.dayOfMonth.toString())
    setRecurringType(subscription.recurringType)
    setCategory(subscription.category)
    setCustomRecurringMonths(subscription.customRecurringMonths?.toString() || '')
    setStartingMonth(subscription.startingMonth.toString())
  }, [subscription])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('id', subscription.id.toString())
    formData.append('title', title)
    formData.append('cost', cost)
    formData.append('category', category)
    formData.append('dayOfMonth', dayOfMonth)
    formData.append('recurringType', recurringType)
    formData.append('customRecurringMonths', customRecurringMonths)
    formData.append('startingMonth', startingMonth)

    await updateSubscription(formData)
    onOpenChange(false)
  }

  const handleDelete = async () => {
    await deleteSubscription(subscription.id)
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
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="insurances">Insurances</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="subscriptions">Subscriptions</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="investments">Investments</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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
            <Button type="button" variant="destructive" onClick={handleDelete} className="mr-auto">
              Delete
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
