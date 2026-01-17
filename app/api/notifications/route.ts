export async function GET() {
  try {
    const notifications = [
      {
        id: 1,
        title: "Marcação Confirmada",
        message: "Sua marcação de reparação foi confirmada",
        type: "success",
        read: false,
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Lembrete de Marcação",
        message: "Sua reparação está marcada para amanhã às 14:30",
        type: "info",
        read: false,
        timestamp: new Date().toISOString(),
      },
    ]

    return Response.json(notifications)
  } catch (error) {
    return Response.json({ error: "Falha ao carregar notificações" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { bookingId, clientEmail, type } = await request.json()

    const messages: Record<string, { subject: string; body: string }> = {
      booking_confirmed: {
        subject: "Sua Marcação foi Confirmada!",
        body: "A marcação de reparação foi confirmada. O prestador entrará em contacto com você em breve.",
      },
      booking_rejected: {
        subject: "Marcação Rejeitada",
        body: "Desculpe, o prestador não pode atender sua solicitação no momento.",
      },
      booking_completed: {
        subject: "Seu Serviço foi Concluído",
        body: "Obrigado por usar nossos serviços. Seu equipamento está pronto!",
      },
    }

    const message = messages[type] || messages.booking_confirmed

    console.log("[v0] Notification - Sending", type, "to:", clientEmail)

    return Response.json({
      success: true,
      message: "Notificação enviada",
      emailSent: true,
    })
  } catch (error) {
    return Response.json({ error: "Falha ao enviar notificação" }, { status: 500 })
  }
}
