import { set } from "date-fns"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function setDatePreserveTime(oldDate: Date, newDate: Date) {
  return set(newDate, {
    hours: oldDate.getHours(),
    minutes: oldDate.getMinutes(),
    seconds: oldDate.getSeconds(),
    milliseconds: oldDate.getMilliseconds()
  })
}
