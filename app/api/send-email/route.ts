import { sendBookingEmail } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const { email, bookingId, clientName, status, serviceDetails } = await request.json()

    if (!email || !bookingId || !clientName || !status) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const subjectMap: Record<string, string> = {
      confirmada: "✅ Sua marcação foi confirmada!",
      rejeitada: "❌ Sua marcação foi rejeitada",
      concluida: "✨ Seu serviço foi concluído!",
    }

    const result = await sendBookingEmail({
      to: email,
      subject: subjectMap[status] || "Atualização de Marcação",
      bookingId,
      clientName,
      status: status as "confirmada" | "rejeitada" | "concluida",
      serviceDetails,
    })

    return Response.json(
      {
        success: true,
        message: "Email enviado com sucesso",
        messageId: result.messageId,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Email API error:", error)
    return Response.json({ success: false, error: "Falha ao enviar email" }, { status: 500 })
  }
}
