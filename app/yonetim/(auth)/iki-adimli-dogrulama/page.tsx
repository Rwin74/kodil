import { AuthCard } from '@/components/admin/auth-card'
import { TwoFactorForm } from '@/components/admin/two-factor-form'

export default function TwoFactorPage() {
  return (
    <AuthCard
      title="İki adımlı doğrulama"
      description="Authenticator uygulamanızdaki güncel kodu veya sakladığınız tek kullanımlık yedek kodlardan birini girin."
    >
      <TwoFactorForm />
    </AuthCard>
  )
}
