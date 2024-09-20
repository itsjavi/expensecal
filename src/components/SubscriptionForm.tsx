'use client'

import { addSubscription } from '@/app/actions/subscriptions'
import { useState } from 'react'

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

export default function SubscriptionForm({ currency }: { currency: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [recurringType, setRecurringType] = useState<string>('monthly')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    await addSubscription({
      title: formData.get('title') as string,
      logo: formData.get('logo') as string,
      cost: parseFloat(formData.get('cost') as string),
      dayOfMonth: parseInt(formData.get('dayOfMonth') as string),
      recurringType: formData.get('recurringType') as 'weekly' | 'fortnightly' | 'monthly' | 'yearly' | 'custom',
      startingMonth: parseInt(formData.get('startingMonth') as string),
      customRecurringMonths:
        formData.get('recurringType') === 'custom'
          ? parseInt(formData.get('customRecurringMonths') as string)
          : undefined,
    })
    setIsOpen(false)
  }

  return (
    <div>
      <button className="btn btn-primary mt-4" onClick={() => setIsOpen(true)}>
        Add Subscription
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Subscription</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label" htmlFor="title">
                  <span className="label-text">Title</span>
                </label>
                <input type="text" id="title" name="title" className="input input-bordered w-full" required />
              </div>
              <div>
                <label className="label" htmlFor="logo">
                  <span className="label-text">Logo URL</span>
                </label>
                <input type="url" id="logo" name="logo" className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label" htmlFor="cost">
                  <span className="label-text">Cost ({currency})</span>
                </label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  step="0.01"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="dayOfMonth">
                  <span className="label-text">Day of Month</span>
                </label>
                <input
                  type="number"
                  id="dayOfMonth"
                  name="dayOfMonth"
                  min="1"
                  max="31"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="recurringType">
                  <span className="label-text">Recurring Type</span>
                </label>
                <select
                  id="recurringType"
                  name="recurringType"
                  className="select select-bordered w-full"
                  required
                  value={recurringType}
                  onChange={(e) => setRecurringType(e.target.value)}
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="fortnightly">Fortnightly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              {recurringType === 'custom' && (
                <div>
                  <label className="label" htmlFor="customRecurringMonths">
                    <span className="label-text">Custom Recurring Months</span>
                  </label>
                  <input
                    type="number"
                    id="customRecurringMonths"
                    name="customRecurringMonths"
                    className="input input-bordered w-full"
                    required
                    min="1"
                  />
                </div>
              )}
              <div>
                <label className="label" htmlFor="startingMonth">
                  <span className="label-text">Starting Month</span>
                </label>
                <select id="startingMonth" name="startingMonth" className="select select-bordered w-full" required>
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" className="btn" onClick={() => setIsOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
