'use client'

import { Button } from '@/components/ui/button'
import { useSelectedDate } from '@/contexts/selected-date-context'
import { addMonths, format, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function DateSelector() {
  const { selectedDate, setSelectedDate } = useSelectedDate()
  const currentDate = new Date()
  const minDate = subMonths(currentDate, 12)

  const goToPreviousMonth = () => {
    const newDate = subMonths(selectedDate, 1)
    if (newDate >= minDate) {
      setSelectedDate(newDate)
    }
  }

  const goToNextMonth = () => {
    const newDate = addMonths(selectedDate, 1)
    setSelectedDate(newDate)
  }

  return (
    <div className="flex items-center justify-start space-x-4 h-[40px]">
      <Button variant="ghost" onClick={goToPreviousMonth} disabled={selectedDate <= minDate}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-lg font-medium w-[150px] text-center">{format(selectedDate, 'MMMM yyyy')}</span>
      <Button variant="ghost" onClick={goToNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
