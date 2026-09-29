import Link from 'next/link'
import { AuthCard } from '@/components/admin/auth-card'
import { PasswordResetRequestForm } from '@/components/admin/password-reset-request-form'

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Parolayı sıfırla"
      description="Hesabın kayıtlı e-posta adresine 30 dakika geçerli, tek kullanımlık bir bağlantı gönderilir."
      footer={
        <Link href="/yonetim/giris" className="text-navy underline-offset-4 hover:underline">
          Giriş sayfasına dön
        </Link>
      }
    >
      <PasswordResetRequestForm />
    </AuthCard>
  )
}
