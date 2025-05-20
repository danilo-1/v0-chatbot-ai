"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
  label?: string
  className?: string
}

export function ImageUpload({ value, onChange, disabled, label = "Imagem", className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      setError("Formato de arquivo inválido. Use JPG, PNG, WEBP ou GIF.")
      return
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5MB.")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao fazer upload da imagem")
      }

      const data = await response.json()
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload da imagem")
    } finally {
      setIsUploading(false)
      // Limpar o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  // Adicionar handler para abrir o seletor de arquivos ao clicar
  const handleClick = () => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Handlers para drag and drop
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !isUploading) {
      e.dataTransfer.dropEffect = "copy"
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled || isUploading) return

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Criar um evento de mudança de arquivo simulado
    const fileInputEl = fileInputRef.current
    if (fileInputEl) {
      // Criar um novo objeto FileList com o arquivo arrastado
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      fileInputEl.files = dataTransfer.files

      // Disparar o evento de mudança
      const event = new Event("change", { bubbles: true })
      fileInputEl.dispatchEvent(event)
    }
  }

  return (
    <div className={className}>
      <Label htmlFor="image-upload">{label}</Label>
      <div className="mt-2">
        {value ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-md border">
            <div className="absolute right-2 top-2 z-10">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemove}
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={value || "/placeholder.svg"}
              alt="Imagem do chatbot"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center rounded-md border ${
              isDragging ? "border-primary bg-primary/10" : "border-dashed"
            } p-12 cursor-pointer`}
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm font-medium">
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Enviando...</span>
                  </div>
                ) : (
                  <span>Clique para fazer upload ou arraste e solte</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">JPG, PNG, WEBP ou GIF (max. 5MB)</p>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <Input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
              ref={fileInputRef}
            />
          </div>
        )}
      </div>
    </div>
  )
}
