import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTeamMember, teamMembers } from '@/lib/team'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return teamMembers.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const member = getTeamMember(slug)
  if (!member) return {}
  return {
    title: `${member.name} | KODİL Ekip Profili`,
    description: `${member.name}, KODİL ekibinde ${member.role.toLocaleLowerCase('tr-TR')} olarak yer alır.`,
    alternates: { canonical: `/ekibimiz/${member.slug}` },
  }
}

export default async function TeamProfilePage({ params }: Props) {
  const { slug } = await params
  const member = getTeamMember(slug)
  if (!member) notFound()

  return (
    <main className="px-4 pb-20 pt-28 sm:pt-36">
      <article className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-card">
          <Image src={member.image} alt={`${member.name}, ${member.role}`} fill priority sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">KODİL ekip profili</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-secondary sm:text-5xl">{member.name}</h1>
          <p className="mt-4 text-lg font-medium text-primary">{member.role}</p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{member.profileText}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Eğitim, unvan ve uzmanlık bilgileri yalnızca doğrulanabilir kaynaklarla desteklendiğinde yayımlanır.</p>
          <Link href="/ekibimiz" className="mt-8 inline-flex font-semibold text-secondary underline decoration-primary decoration-2 underline-offset-4">Tüm ekibi görüntüle</Link>
        </div>
      </article>
    </main>
  )
}
