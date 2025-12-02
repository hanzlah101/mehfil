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

export type MealType = "lunch" | "dinner"

export function getMealTypeFromTimes(
  startTime: Date | number,
  _endTime: Date | number
): MealType {
  const start = typeof startTime === "number" ? new Date(startTime) : startTime
  const startHour = start.getHours()

  // Lunch: 12 PM - 4 PM (12-16)
  // Dinner: 6 PM - 10 PM (18-22)
  if (startHour >= 12 && startHour < 16) {
    return "lunch"
  }
  return "dinner"
}

export function getMealTypeTimes(
  date: Date,
  mealType: MealType
): { startTime: Date; endTime: Date } {
  const defaultOpts = { minutes: 0, seconds: 0, milliseconds: 0 }

  if (mealType === "lunch") {
    return {
      startTime: set(date, { hours: 12, ...defaultOpts }), // 12 PM
      endTime: set(date, { hours: 16, ...defaultOpts }) // 4 PM
    }
  } else {
    return {
      startTime: set(date, { hours: 18, ...defaultOpts }), // 6 PM
      endTime: set(date, { hours: 22, ...defaultOpts }) // 10 PM
    }
  }
}

export function formatMealType(mealType: MealType): string {
  return mealType === "lunch" ? "Lunch" : "Dinner"
}
