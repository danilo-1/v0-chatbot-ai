"use client"

import type React from "react"

import { useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Loader2, X } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
  label?: string
}

export function ImageUpload({ value, onChange, disabled, label = "Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled) return

    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      await uploadFile(file)
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      await uploadFile(e.target.files[0])
    }
  }

  const uploadFile = async (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onChange("")
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 transition-colors
          ${isDragging ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25"}
          ${disabled ? "cursor-not-allowed opacity-60" : "hover:bg-primary/5"}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled || isUploading}
          className="sr-only"
        />

        {isUploading && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        )}

        {!isUploading && !value && (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                <line x1="16" x2="22" y1="5" y2="5" />
                <line x1="19" x2="19" y1="2" y2="8" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <p className="text-sm font-medium">Drag & drop or click to upload</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP or GIF (max. 5MB)</p>
          </div>
        )}

        {!isUploading && value && (
          <div className="relative aspect-square h-full w-full">
            <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="rounded-md object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
