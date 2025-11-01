import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiSpam2Fill,
  RiAlertFill
} from "@remixicon/react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      richColors
      position="top-right"
      theme={theme as ToasterProps["theme"]}
      icons={{
        success: <RiCheckboxCircleFill className="size-4" />,
        info: <RiErrorWarningFill className="size-4" />,
        warning: <RiAlertFill className="size-4" />,
        error: <RiSpam2Fill className="size-4" />,
        loading: <Spinner />
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)"
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
