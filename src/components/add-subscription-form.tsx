'use client'

import { addSubscription } from '@/app/actions/subscriptions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRef } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Adding...' : 'Add Subscription'}
    </Button>
  )
}

export default function AddSubscriptionForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Add New Subscription</h2>
      <form
        ref={formRef}
        action={async (formData) => {
          await addSubscription(formData)
          formRef.current?.reset()
        }}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>
        <div>
          <Label htmlFor="cost">Cost</Label>
          <Input id="cost" name="cost" type="number" required />
        </div>
        <div>
          <Label htmlFor="dayOfMonth">Day of Month</Label>
          <Input id="dayOfMonth" name="dayOfMonth" type="number" min="1" max="31" required />
        </div>
        <div>
          <Label htmlFor="recurringType">Recurring Type</Label>
          <Select name="recurringType" required>
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
        <div>
          <Label htmlFor="customRecurringMonths">Custom Recurring Months (if applicable)</Label>
          <Input id="customRecurringMonths" name="customRecurringMonths" type="number" />
        </div>
        <div>
          <Label htmlFor="startingMonth">Starting Month</Label>
          <Select name="startingMonth" required>
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
        <SubmitButton />
      </form>
    </div>
  )
}
