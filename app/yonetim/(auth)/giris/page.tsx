import Link from 'next/link'
import { AuthCard } from '@/components/admin/auth-card'
import { LoginForm } from '@/components/admin/login-form'

const STATUS_MESSAGES: Record<string, string> = {
  'hesap-kapali': 'Bu hesap etkin değil. Bir yöneticiyle iletişime geçin.',
  yetkisiz: 'Bu hesabın yönetim alanına erişim rolü yok.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string }>
}) {
  const { durum } = await searchParams
  const statusMessage = durum ? STATUS_MESSAGES[durum] : undefined

  return (
    <AuthCard
      title="Yönetim girişi"
      description="Yönetim alanına yalnız yetkilendirilmiş hesaplar ve zorunlu iki adımlı doğrulamayla erişilir."
      footer={
        <Link href="/" className="text-navy underline-offset-4 hover:underline">
          Siteye dön
        </Link>
      }
    >
      {statusMessage ? (
        <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {statusMessage}
        </p>
      ) : null}
      <LoginForm />
    </AuthCard>
  )
}
