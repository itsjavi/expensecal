'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatCurrency } from '@/lib/utils'
import { type Transaction } from '@/models/schema'
import { DownloadIcon, Pencil } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import AddExpenseDialog from './add-expense-dialog'
import EditExpenseDialog from './edit-expense-dialog'

type ExpenseListProps = {
  subscriptions: Transaction[]
  currency: string
}

export default function ExpenseList({ subscriptions, currency }: ExpenseListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Transaction | null>(null)

  function ExportButton({ href, label }: { href: string; label: string }) {
    return (
      <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
        <a href={href} download>
          <DownloadIcon className="h-4 w-4 mr-2" />
          {label}
        </a>
      </Button>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>Your Expenses</div>
          <Button onClick={() => setIsAddDialogOpen(true)}>+ Add</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden max-h-[calc(100vh-24.7rem)]">
        {subscriptions.length === 0 ? (
          <p>You haven't added any expenses yet.</p>
        ) : (
          <ScrollArea className="h-full">
            <ul className="space-y-4">
              {subscriptions.map((sub, index) => (
                <li
                  key={sub.id}
                  className={`flex items-center justify-between ${
                    index !== subscriptions.length - 1 ? 'border-b pb-2' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-4 font-medium">
                      {sub.logo && (
                        <Image src={sub.logo} alt={sub.title} width={32} height={32} className="rounded-full" />
                      )}
                      <div>
                        <div className="font-medium">{sub.title}</div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(sub.amount, currency)} / {sub.recurringType}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setEditingSubscription(sub)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
      <AddExpenseDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      {editingSubscription && (
        <EditExpenseDialog
          subscription={editingSubscription}
          open={!!editingSubscription}
          onOpenChange={(open) => {
            if (!open) setEditingSubscription(null)
          }}
        />
      )}
      <CardFooter>
        <ExportButton href="/api/export/recurring" label="Export Recurring Expenses" />
      </CardFooter>
    </Card>
  )
}
