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
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [showPassword, setShowPassword] = React.useState(false)

  const Icon = showPassword ? RiEyeOffFill : RiEyeFill

  function handleToggle() {
    if (!inputRef.current) return

    const { selectionStart, selectionEnd } = inputRef.current
    setShowPassword((p) => !p)

    setTimeout(() => {
      const input = inputRef.current
      if (!input) return

      input.focus()
      if (selectionStart && selectionEnd) {
        input.setSelectionRange(selectionStart, selectionEnd)
      }
    }, 0)
  }

  return (
    <InputGroup>
      <InputGroupInput
        value={value}
        placeholder="•••••••"
        type={showPassword ? "text" : "password"}
        {...props}
        ref={inputRef}
      />

      <InputGroupAddon align="inline-end">
        {value && (
          <InputGroupButton
            size="icon-xs"
            className="opacity-60 hover:bg-transparent hover:text-foreground hover:opacity-100 dark:hover:bg-transparent"
            onClick={handleToggle}
          >
            <Icon className="size-4" />
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </InputGroupButton>
        )}
      </InputGroupAddon>
    </InputGroup>
  )
}
