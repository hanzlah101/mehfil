import { set } from "date-fns"

export function setDatePreserveTime(oldDate: Date, newDate: Date) {
  return set(newDate, {
    hours: oldDate.getHours(),
    minutes: oldDate.getMinutes(),
    seconds: oldDate.getSeconds(),
    milliseconds: oldDate.getMilliseconds()
  })
}

export function defaultEventTime(date: Date) {
  const defaultOpts = { minutes: 0, seconds: 0, milliseconds: 0 }
  const defaultStartTime = set(date, { hours: 18, ...defaultOpts }) // 6 PM
  const defaultEndTime = set(date, { hours: 22, ...defaultOpts }) // 10 PM
  return { defaultStartTime, defaultEndTime }
}
