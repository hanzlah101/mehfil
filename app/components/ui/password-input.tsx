"use client"

import * as React from "react"
import { RiEyeFill, RiEyeOffFill } from "@remixicon/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@/components/ui/input-group"

export function PasswordInput({
  value,
  ...props
}: Omit<React.ComponentProps<typeof InputGroupInput>, "type">) {
  const [showPassword, setShowPassword] = React.useState(false)

  const Icon = showPassword ? RiEyeOffFill : RiEyeFill

  return (
    <InputGroup>
      <InputGroupInput
        value={value}
        placeholder="•••••••"
        type={showPassword ? "text" : "password"}
        {...props}
      />

      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          className="opacity-60 hover:bg-transparent hover:text-foreground hover:opacity-100 dark:hover:bg-transparent"
          onClick={() => setShowPassword((p) => !p)}
        >
          <Icon className="size-4" />
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
