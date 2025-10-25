import { set } from "date-fns"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine multiple class name inputs into a single, conflict-resolved class string.
 *
 * @param inputs - One or more clsx-compatible class value inputs (strings, arrays, objects, etc.)
 * @returns The merged class name string with Tailwind CSS conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a Date with the calendar date from `newDate` and the time components from `oldDate`.
 *
 * @param oldDate - Date to take hours, minutes, seconds, and milliseconds from
 * @param newDate - Date to take year, month, and day from
 * @returns A Date combining `newDate`'s date and `oldDate`'s time components
 */
export function setDatePreserveTime(oldDate: Date, newDate: Date) {
  return set(newDate, {
    hours: oldDate.getHours(),
    minutes: oldDate.getMinutes(),
    seconds: oldDate.getSeconds(),
    milliseconds: oldDate.getMilliseconds()
  })
}