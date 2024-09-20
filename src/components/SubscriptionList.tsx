'use client'

import { deleteSubscription, updateSubscription } from '@/app/actions/subscriptions'
import type { Subscription } from '@/models/schema'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function SubscriptionList({ subscriptions }: { subscriptions: Subscription[]; currency: string }) {
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleEdit = (id: number) => {
    setEditingId(id)
  }

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>, id: number) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    await updateSubscription(id, {
      title: formData.get('title') as string,
      logo: formData.get('logo') as string,
      cost: parseFloat(formData.get('cost') as string),
      dayOfMonth: parseInt(formData.get('dayOfMonth') as string),
      recurringType: formData.get('recurringType') as 'weekly' | 'fortnightly' | 'monthly' | 'yearly' | 'custom',
      customRecurringMonths:
        formData.get('recurringType') === 'custom'
          ? parseInt(formData.get('customRecurringMonths') as string)
          : undefined,
    })
    setEditingId(null)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      await deleteSubscription(id)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Cost</th>
            <th>Recurring</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub.id}>
              {editingId === sub.id ? (
                <td colSpan={4}>
                  <form onSubmit={(e) => handleUpdate(e, sub.id)} className="space-y-2">
                    <input name="title" defaultValue={sub.title} className="input input-bordered w-full" required />
                    <input name="logo" defaultValue={sub.logo || ''} className="input input-bordered w-full" required />
                    <input
                      name="cost"
                      type="number"
                      step="0.01"
                      defaultValue={sub.cost / 100}
                      className="input input-bordered w-full"
                      required
                    />
                    <input
                      name="dayOfMonth"
                      type="number"
                      min="1"
                      max="31"
                      defaultValue={sub.dayOfMonth}
                      className="input input-bordered w-full"
                      required
                    />
                    <select
                      name="recurringType"
                      defaultValue={sub.recurringType}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="weekly">Weekly</option>
                      <option value="fortnightly">Fortnightly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="custom">Custom</option>
                    </select>
                    {sub.recurringType === 'custom' && (
                      <input
                        name="customRecurringMonths"
                        type="number"
                        defaultValue={sub.customRecurringMonths || 1}
                        className="input input-bordered w-full"
                        required
                      />
                    )}
                    <div className="flex justify-end space-x-2">
                      <button type="button" className="btn" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Update
                      </button>
                    </div>
                  </form>
                </td>
              ) : (
                <>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          {sub.logo ? (
                            <img src={sub.logo} alt={sub.title} />
                          ) : (
                            <div className="w-12 h-12 bg-base-300">{sub.title[0]}</div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{sub.title}</div>
                      </div>
                    </div>
                  </td>
                  <td>${(sub.cost / 100).toFixed(2)}</td>
                  <td>
                    {sub.recurringType}
                    {sub.recurringType === 'custom' ? ` (${sub.customRecurringMonths} months)` : ''}
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-xs" onClick={() => handleEdit(sub.id)}>
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="btn btn-ghost btn-xs" onClick={() => handleDelete(sub.id)}>
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
