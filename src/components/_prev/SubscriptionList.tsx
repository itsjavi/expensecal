'use client'

import { deleteSubscription } from '@/app/actions/subscriptions'
import { formatCurrency } from '@/lib/utils'
import type { Subscription } from '@/models/schema'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
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

export default function SubscriptionList({
  subscriptions,
  currency,
}: {
  subscriptions: Subscription[]
  currency: string
}) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingRecurringType, setEditingRecurringType] = useState<string>('monthly')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>, _id: number) => {
    event.preventDefault()
    // const formData = new FormData(event.currentTarget)
    // await updateSubscription(id, {
    //   title: formData.get('title') as string,
    //   logo: formData.get('logo') as string,
    //   cost: parseFloat(formData.get('cost') as string),
    //   dayOfMonth: parseInt(formData.get('dayOfMonth') as string),
    //   recurringType: formData.get('recurringType') as 'weekly' | 'fortnightly' | 'monthly' | 'yearly' | 'custom',
    //   customRecurringMonths:
    //     formData.get('recurringType') === 'custom'
    //       ? parseInt(formData.get('customRecurringMonths') as string)
    //       : undefined,
    //   startingMonth: parseInt(formData.get('startingMonth') as string),
    // })
    setEditingId(null)
  }

  const handleDelete = async (id: number) => {
    await deleteSubscription(id)
    setDeletingId(null)
  }

  return (
    <div className="overflow-x-auto">
      <div className="hidden md:grid grid-cols-5 gap-4 font-bold mb-2 p-4">
        <div>Title</div>
        <div>Cost</div>
        <div>Recurring</div>
        <div>Day of Month</div>
        <div>Actions</div>
      </div>
      {subscriptions.map((sub) => (
        <div key={sub.id} className="bg-base-200 p-4 rounded-lg mb-2">
          {editingId === sub.id ? (
            <form onSubmit={(e) => handleUpdate(e, sub.id)} className="space-y-2">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input name="title" defaultValue={sub.title} className="input input-bordered w-full" required />

              <label className="label">
                <span className="label-text">Cost ({currency})</span>
              </label>
              <input
                name="cost"
                type="number"
                step="0.01"
                defaultValue={sub.cost / 100}
                className="input input-bordered w-full"
                required
              />

              <label className="label">
                <span className="label-text">Recurring Type</span>
              </label>
              <select
                name="recurringType"
                defaultValue={sub.recurringType}
                className="select select-bordered w-full"
                required
                onChange={(e) => setEditingRecurringType(e.target.value)}
              >
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
              </select>

              {editingRecurringType === 'custom' && (
                <>
                  <label className="label">
                    <span className="label-text">Custom Recurring Months</span>
                  </label>
                  <input
                    name="customRecurringMonths"
                    type="number"
                    defaultValue={sub.customRecurringMonths || 1}
                    className="input input-bordered w-full"
                    required
                    min="1"
                  />
                </>
              )}

              <label className="label">
                <span className="label-text">Day of Month</span>
              </label>
              <input
                name="dayOfMonth"
                type="number"
                min="1"
                max="31"
                defaultValue={sub.dayOfMonth}
                className="input input-bordered w-full"
                required
              />

              <label className="label">
                <span className="label-text">Starting Month</span>
              </label>
              <select
                name="startingMonth"
                defaultValue={sub.startingMonth}
                className="select select-bordered w-full"
                required
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-2">
                <button type="button" className="btn btn-sm" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-primary">
                  Update
                </button>
              </div>
            </form>
          ) : (
            <div className="md:grid md:grid-cols-5 md:gap-4 md:items-center space-y-2 md:space-y-0">
              <div className="font-bold md:font-normal">{sub.title}</div>
              <div>{formatCurrency(sub.cost, currency)}</div>
              <div>
                {sub.recurringType === 'custom' ? `every ${sub.customRecurringMonths} months` : sub.recurringType}
              </div>
              <div>{sub.dayOfMonth}</div>
              <div className="flex justify-end space-x-2">
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => {
                    setEditingId(sub.id)
                    setEditingRecurringType(sub.recurringType)
                  }}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => setDeletingId(sub.id)}>
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Confirmation Modal */}
      {deletingId && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">Are you sure you want to delete this subscription?</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setDeletingId(null)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={() => handleDelete(deletingId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
