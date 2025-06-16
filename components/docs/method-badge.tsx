import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MethodBadgeProps {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  className?: string
}

const methodColors = {
  GET: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  POST: "bg-green-100 text-green-800 hover:bg-green-200",
  PUT: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  DELETE: "bg-red-100 text-red-800 hover:bg-red-200",
  PATCH: "bg-purple-100 text-purple-800 hover:bg-purple-200",
}

export function MethodBadge({ method, className }: MethodBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(methodColors[method], "font-mono font-semibold", className)}>
      {method}
    </Badge>
  )
}
