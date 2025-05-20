import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Adicionar a função getChatbot
export async function getChatbot(id: string) {
  try {
    const response = await fetch(`/api/chatbots/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch chatbot")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching chatbot:", error)
    throw error
  }
}
