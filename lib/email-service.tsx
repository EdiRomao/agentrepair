import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    : undefined,
})

interface EmailOptions {
  to: string
  subject: string
  bookingId: string
  clientName: string
  status: "confirmada" | "rejeitada" | "concluida"
  serviceDetails?: {
    serviceName: string
    equipmentType: string
    preferredDate: string
  }
}

export async function sendBookingEmail(options: EmailOptions) {
  const { to, subject, bookingId, clientName, status, serviceDetails } = options

  const statusColors: Record<string, { bg: string; text: string }> = {
    confirmada: { bg: "#dcfce7", text: "#166534" },
    rejeitada: { bg: "#fee2e2", text: "#991b1b" },
    concluida: { bg: "#dbeafe", text: "#0c4a6e" },
  }

  const statusMessages: Record<string, string> = {
    confirmada: "Sua marcação foi confirmada! O prestador entrará em contacto em breve.",
    rejeitada: "Infelizmente sua marcação foi rejeitada. Tente novamente com outro prestador.",
    concluida: "Seu serviço foi concluído! Obrigado por usar nossa plataforma.",
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 8px 0 0 0; opacity: 0.9; }
          .content { padding: 30px; background: #fafafa; }
          .status-badge { display: inline-block; padding: 10px 20px; border-radius: 6px; font-weight: 600; margin: 15px 0; background: ${statusColors[status].bg}; color: ${statusColors[status].text}; }
          .booking-id { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #1e40af; }
          .booking-id-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
          .booking-id-value { font-size: 20px; font-weight: 700; font-family: 'Courier New', monospace; color: #1e40af; margin-top: 5px; }
          .details-section { background: white; padding: 20px; border-radius: 6px; margin: 15px 0; }
          .details-section h3 { margin: 0 0 15px 0; color: #1e40af; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
          .detail-item { margin: 10px 0; }
          .detail-label { color: #6b7280; font-size: 12px; text-transform: uppercase; }
          .detail-value { color: #0f1419; font-weight: 500; margin-top: 4px; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
          .button { background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; font-weight: 600; }
          .message-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚙️ BookService</h1>
            <p>Sistema de Reparação de Equipamentos</p>
          </div>
          
          <div class="content">
            <p>Olá <strong>${clientName}</strong>,</p>
            
            <div class="message-box">
              <div class="status-badge">${status.charAt(0).toUpperCase() + status.slice(1)}</div>
              <p>${statusMessages[status]}</p>
            </div>

            <div class="booking-id">
              <div class="booking-id-label">ID da sua marcação</div>
              <div class="booking-id-value">${bookingId}</div>
            </div>

            ${
              serviceDetails
                ? `
            <div class="details-section">
              <h3>Detalhes da Marcação</h3>
              <div class="detail-item">
                <div class="detail-label">Serviço</div>
                <div class="detail-value">${serviceDetails.serviceName}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Equipamento</div>
                <div class="detail-value">${serviceDetails.equipmentType}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Data Prevista</div>
                <div class="detail-value">${serviceDetails.preferredDate}</div>
              </div>
            </div>
            `
                : ""
            }

            <p>Se tiver dúvidas ou precisar de mais informações, contacte-nos:</p>
            <ul style="color: #6b7280;">
              <li>Email: suporte@bookservice.com</li>
              <li>Telefone: +351 XXX XXX XXX</li>
            </ul>

            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/client/track" class="button">Ver Minha Marcação</a>
          </div>

          <div class="footer">
            <p>&copy; 2025 BookService. Todos os direitos reservados.</p>
            <p>Este é um email automático. Por favor não responda diretamente.</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@bookservice.com",
      to,
      subject,
      html: htmlContent,
    })

    console.log("[v0] Email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("[v0] Email sending failed:", error)
    throw error
  }
}
