import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Processar o upload
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Validar tipo de arquivo
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Formato de arquivo inválido" }, { status: 400 })
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Arquivo muito grande (máximo 5MB)" }, { status: 400 })
    }

    // Gerar nome de arquivo único
    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`

    // Criar diretório de uploads se não existir
    const publicDir = join(process.cwd(), "public")
    const uploadsDir = join(publicDir, "uploads")

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    try {
      // Converter o arquivo para um Buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Salvar o arquivo
      const filePath = join(uploadsDir, fileName)
      await writeFile(filePath, buffer)

      // Retornar a URL do arquivo
      const fileUrl = `/uploads/${fileName}`
      return NextResponse.json({ url: fileUrl })
    } catch (error) {
      console.error("Erro ao salvar arquivo:", error)
      return NextResponse.json({ error: "Erro ao processar o upload" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro no upload:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
