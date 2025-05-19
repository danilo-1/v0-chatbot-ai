import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converte um objeto potencialmente não extensível em um objeto extensível simples
 * Isso resolve o erro "Cannot add property values, object is not extensible"
 */
export function toExtensibleObject<T>(obj: T): T {
  if (!obj || typeof obj !== "object") {
    return obj
  }

  // Cria um novo objeto simples com as mesmas propriedades
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Converte um array de objetos potencialmente não extensíveis em objetos extensíveis
 */
export function toExtensibleArray<T>(arr: T[]): T[] {
  if (!Array.isArray(arr)) {
    return []
  }

  return arr.map((item) => toExtensibleObject(item))
}
