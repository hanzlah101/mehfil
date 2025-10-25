import { createParser } from "nuqs"
import { startOfMonth, isValid, parse } from "date-fns"

function getCurrentMonthStart() {
  return startOfMonth(new Date())
}

export const monthParser = createParser<Date>({
  parse(value) {
    const match = /^(\d{1,2})(\d{4})$/.exec(value)
    if (!match) return getCurrentMonthStart()

    const month = parseInt(match[1], 10)
    const year = parseInt(match[2], 10)

    if (month < 1 || month > 12 || year < 1900 || year > 2100) {
      return getCurrentMonthStart()
    }

    const date = parse(`${year}-${month}-01`, "yyyy-M-dd", new Date())
    return isValid(date) ? startOfMonth(date) : getCurrentMonthStart()
  },

  serialize(date) {
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${month}${year}`
  },

  eq(a, b) {
    return a.getTime() === b.getTime()
  }
})
