/**
 * Render a seven-column header row with weekday abbreviations (Sun–Sat).
 *
 * Renders a single grid container with seven child cells, one for each day of the week from Sunday through Saturday.
 *
 * @returns A JSX element containing a grid of weekday abbreviations from Sunday to Saturday.
 */
export function CalendarDays() {
  return (
    <div className="grid grid-cols-7 py-2 text-center text-sm font-light text-muted-foreground lg:flex-none">
      <div>Sun</div>
      <div>Mon</div>
      <div>Tue</div>
      <div>Wed</div>
      <div>Thu</div>
      <div>Fri</div>
      <div>Sat</div>
    </div>
  )
}