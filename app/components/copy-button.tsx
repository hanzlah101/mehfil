import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { RiCheckFill, RiFileCopyFill } from "@remixicon/react"

export function CopyButton({
  text,
  className
}: {
  text: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    } catch {
      toast.error("Your browser doesn't support copy")
    } finally {
      setTimeout(() => setCopied(false), 1000)
    }
  }

  return (
    <Button
      size="icon-sm"
      variant="ghost"
      onClick={handleCopy}
      className={cn(
        "text-muted-foreground transition-colors hover:text-foreground [&>svg]:size-4",
        className
      )}
    >
      {copied ? <RiCheckFill /> : <RiFileCopyFill />}
    </Button>
  )
}
