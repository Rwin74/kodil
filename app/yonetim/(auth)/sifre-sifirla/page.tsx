import { AuthCard } from '@/components/admin/auth-card'
import { PasswordResetForm } from '@/components/admin/password-reset-form'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>
}) {
  const { token, error } = await searchParams

  return (
    <AuthCard
      title="Yeni parola belirle"
      description="En az 12 karakterli, başka bir hesapta kullanmadığınız güçlü bir parola seçin."
    >
      <PasswordResetForm token={error ? '' : token ?? ''} />
    </AuthCard>
  )
}
