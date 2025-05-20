import { NextResponse } from "next/server"
import { mkdir, access } from "fs/promises"
import { join } from "path"
import { constants } from "fs"

export async function GET() {
  try {
    const publicDir = join(process.cwd(), "public")
    const uploadsDir = join(publicDir, "uploads")

    // Verificar se o diretório de uploads existe
    try {
      await access(uploadsDir, constants.F_OK)
      console.log("Diretório de uploads já existe")
    } catch (error) {
      // Criar diretório se não existir
      console.log("Criando diretório de uploads...")
      await mkdir(uploadsDir, { recursive: true })
      console.log("Diretório de uploads criado com sucesso")
    }

    return NextResponse.json({ success: true, message: "Diretório de uploads verificado/criado com sucesso" })
  } catch (error) {
    console.error("Erro ao verificar/criar diretório de uploads:", error)
    return NextResponse.json(
      { error: "Erro ao verificar/criar diretório de uploads", details: String(error) },
      { status: 500 },
    )
  }
}
