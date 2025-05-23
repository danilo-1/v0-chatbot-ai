import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CustomAlertProps {
  title: string
  description: string
}

export function CustomAlert({ title, description }: CustomAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

// Exportar o ícone para compatibilidade
export { AlertCircle }
