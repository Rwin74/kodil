import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yönetim',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export const dynamic = 'force-dynamic'

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  return <div data-management-root="true">{children}</div>
}
