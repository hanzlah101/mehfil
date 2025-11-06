import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"

function FilterRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid grid-cols-3 gap-1.5 md:gap-3", className)}
      {...props}
    />
  )
}

interface FilterRadioItemProps
  extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  label: string
}

function FilterRadioItem({ className, label, ...props }: FilterRadioItemProps) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "group relative flex items-center justify-center rounded-lg border border-border bg-background px-1.5 py-2 transition-all md:px-3 md:py-3",
        "hover:border-primary/50 hover:bg-accent/50",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 data-[state=checked]:shadow-sm",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="text-xs text-foreground group-data-[state=checked]:text-primary md:text-sm md:font-medium">
        {label}
      </span>
    </RadioGroupPrimitive.Item>
  )
}

export { FilterRadioGroup, FilterRadioItem }
