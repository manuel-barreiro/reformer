import { parse, format, set } from "date-fns"
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz"

export const TIMEZONE = "America/Argentina/Buenos_Aires"

export function localToUTC(dateString: string, timeString: string): Date {
  // Parse the local date and time
  const baseDate = parse(dateString, "yyyy-MM-dd", new Date())
  const [hours, minutes] = timeString.split(":").map(Number)

  // Create a date object with the correct local time
  const localDateTime = set(baseDate, {
    hours,
    minutes,
    seconds: 0,
    milliseconds: 0,
  })

  // Convert local time to UTC while preserving the intended local time
  const utcDate = zonedTimeToUtc(localDateTime, TIMEZONE)

  return utcDate
}

export function utcToLocal(date: Date): Date {
  return utcToZonedTime(date, TIMEZONE)
}

export function formatLocalDate(date: Date): string {
  const localDate = utcToLocal(date)
  return format(localDate, "yyyy-MM-dd")
}

export function formatLocalTime(date: Date): string {
  const localDate = utcToLocal(date)
  return format(localDate, "HH:mm")
}
