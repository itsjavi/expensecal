'use client'

import { deleteUser, updateUserSettings } from '@/app/actions/user'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [currency, setCurrency] = useState(session?.user?.currency || 'USD')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleCurrencyChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await updateUserSettings({ currency })
    update() // Update the session to reflect the new currency
  }

  const handleDeleteAccount = async () => {
    await deleteUser()
    // Redirect to home page or sign out
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Settings</h1>

      <form onSubmit={handleCurrencyChange} className="mb-8">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Currency</span>
          </label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="input input-bordered"
            placeholder="Enter currency code (e.g., USD, EUR, GBP)"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Save Currency
        </button>
      </form>

      <div>
        <button onClick={() => setIsDeleteModalOpen(true)} className="btn btn-error">
          Delete Account
        </button>
      </div>

      {isDeleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Account Deletion</h3>
            <p className="py-4">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="modal-action">
              <button onClick={() => setIsDeleteModalOpen(false)} className="btn">
                Cancel
              </button>
              <button onClick={handleDeleteAccount} className="btn btn-error">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
