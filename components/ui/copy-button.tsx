"use client"

import type React from "react"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setHasCopied(true)
      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to copy text: ", error)
    }
  }

  return (
    <Button size="sm" variant="ghost" className={className} onClick={copyToClipboard} {...props}>
      {hasCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
      <span className="sr-only">{hasCopied ? "Copiado" : "Copiar"}</span>
    </Button>
  )
}
