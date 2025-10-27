import { useTheme } from "next-themes"
import { RiMoonFill, RiSunFill } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Toggle theme"
          className="size-7"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <RiSunFill className="hidden opacity-60 dark:block" />
          <RiMoonFill className="opacity-60 dark:hidden" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Switch to {resolvedTheme === "dark" ? "Light" : "Dark"} Mode
      </TooltipContent>
    </Tooltip>
  )
}
