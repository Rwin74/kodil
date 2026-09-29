import { AuthCard } from '@/components/admin/auth-card'
import { MfaEnrollmentForm } from '@/components/admin/mfa-enrollment-form'
import { requireEnrollmentSession } from '@/lib/auth/dal'

export default async function MfaEnrollmentPage() {
  await requireEnrollmentSession()

  return (
    <AuthCard
      title="MFA kurulumu zorunlu"
      description="Yönetim verisine erişmeden önce bir TOTP authenticator uygulaması bağlayın ve yedek kodları güvenli biçimde saklayın."
    >
      <MfaEnrollmentForm />
    </AuthCard>
  )
}
