import 'server-only'

import nodemailer from 'nodemailer'

type ResetEmailInput = {
  email: string
  displayName: string
  resetUrl: string
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[character] as string,
  )
}

function smtpTransport() {
  const port = Number(process.env.SMTP_PORT)

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE?.trim() === 'true' || port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

export async function sendPasswordResetEmail({ email, displayName, resetUrl }: ResetEmailInput) {
  const safeName = escapeHtml(displayName)
  const safeUrl = escapeHtml(resetUrl)

  await smtpTransport().sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'KODİL Yönetim parola sıfırlama',
    text: [
      `Merhaba ${displayName},`,
      '',
      'KODİL Yönetim parolanızı sıfırlamak için aşağıdaki bağlantıyı kullanın:',
      resetUrl,
      '',
      'Bu isteği siz yapmadıysanız e-postayı yok sayın.',
    ].join('\n'),
    html: `<p>Merhaba ${safeName},</p><p>KODİL Yönetim parolanızı sıfırlamak için <a href="${safeUrl}">bu güvenli bağlantıyı</a> kullanın.</p><p>Bu isteği siz yapmadıysanız e-postayı yok sayın.</p>`,
  })
}
