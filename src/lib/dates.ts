import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const dayJsExtended = dayjs

export function newDate(value?: number | string | Date): Date {
  if (value) {
    return new Date(value)
  }
  return new Date()
}

export function newDateUTC(value?: number | string | Date): Date {
  const date = newDate(value)
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds(),
    ),
  )
}

export function newFutureDate(addedMilliseconds: number): Date {
  return new Date(Date.now() + addedMilliseconds)
}

export function nowMs(): number {
  return Date.now()
}

export function relativeTimeFromNow(date: string | Date): string {
  return dayJsExtended(date).fromNow()
}

export function dateToDbTimestamp(date: string | Date): string {
  return dayJsExtended(date).format('YYYY-MM-DD HH:mm:ss')
}
