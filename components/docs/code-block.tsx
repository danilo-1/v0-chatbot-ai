"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  className?: string
}

export function CodeBlock({ code, language = "json", title, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative", className)}>
      {title && (
        <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border-b">
          <span className="text-sm font-medium">{title}</span>
          <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-6 w-6 p-0">
            {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      )}
      <pre className={cn("bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm", title ? "rounded-t-none" : "")}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
      {!title && (
        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="absolute top-2 right-2 h-6 w-6 p-0">
          {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
        </Button>
      )}
    </div>
  )
}
