import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const chatbotId = params.id

    // Verificar se o chatbot existe
    const chatbot = await db.chatbot.findUnique({
      where: { id: chatbotId },
      select: {
        id: true,
        name: true,
        userId: true,
      },
    })

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    // Obter dados do formulário
    const { name, email, subject, message } = await request.json()

    // Validar dados
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Salvar mensagem de contato
    const contact = await db.chatbotContact.create({
      data: {
        chatbotId,
        name,
        email,
        subject,
        message,
        status: "PENDING",
      },
    })

    // Registrar telemetria
    await db.chatbotTelemetry.create({
      data: {
        chatbotId,
        event: "CONTACT_FORM_SUBMITTED",
        metadata: {
          contactId: contact.id,
          name,
          email,
          subject,
        },
      },
    })

    return NextResponse.json({ success: true, message: "Contact form submitted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
