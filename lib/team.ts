import { absoluteUrl } from '@/lib/site'
export type VerifiedEducation = { credential: string; institution: string; field?: string; sourceUrl: string; verifiedIsoDate: string }
export type VerifiedExpertise = { name: string; sourceUrl: string; verifiedIsoDate: string }
export type VerifiedExternalProfile = { kind: 'linkedin' | 'professional-association' | 'institutional-directory' | 'wikidata'; label: string; url: string; verifiedIsoDate: string; verificationReference: string }

export type TeamMember = {
  slug: string
  name: string
  role: string
  image: string
  accent: string
  profileText: string
  bio?: string
  verifiedEducation?: readonly VerifiedEducation[]
  verifiedExpertise?: readonly VerifiedExpertise[]
  verifiedExternalProfiles?: readonly VerifiedExternalProfile[]
}

export const teamMembers: TeamMember[] = [
  {
    slug: 'nergis-denizci-ceylan',
    name: 'Nergis DENİZCİ CEYLAN',
    role: 'Kurucu - Dil ve Konuşma Terapisti',
    image: '/images/team/nergis-denizci-ceylan-dil-ve-konusma-terapisti.webp',
    accent: 'var(--orange)',
    profileText: 'KODİL ekibinde kurucu ve dil ve konuşma terapisti olarak yer alır.',
  },
  {
    slug: 'enes-ceylan',
    name: 'Enes CEYLAN',
    role: 'Dil ve Konuşma Terapisti',
    image: '/images/team/enes-ceylan-uzman-dil-ve-konusma-terapisti.webp',
    accent: 'var(--navy)',
    profileText: 'KODİL ekibinde dil ve konuşma terapisti olarak yer alır.',
  },
  {
    slug: 'nursah-yardimci',
    name: 'Nurşah YARDIMCI',
    role: 'Dil ve Konuşma Terapisti',
    image: '/images/team/nursah-yardimci-uzman-dil-ve-konusma-terapisti.webp',
    accent: 'var(--turquoise)',
    profileText: 'KODİL ekibinde dil ve konuşma terapisti olarak yer alır.',
  },
  {
    slug: 'bugra-ceylan',
    name: 'Buğra CEYLAN',
    role: 'Dil ve Konuşma Terapisti',
    image: '/images/team/bugra-ceylan-dil-ve-konusma-terapisti-v2.webp',
    accent: 'var(--navy)',
    profileText: 'KODİL ekibinde dil ve konuşma terapisti olarak yer alır.',
  },
  {
    slug: 'ruveyda-dabak',
    name: 'Rüveyda DABAK',
    role: 'Ergoterapist',
    image: '/images/team/ruveyda-dabak-ergoterapist.webp',
    accent: 'var(--leaf)',
    profileText: 'KODİL ekibinde ergoterapist olarak yer alır.',
  },
  {
    slug: 'goksen-karatas',
    name: 'Gökşen KARATAŞ',
    role: 'Psikolog',
    image: '/images/team/goksen-karatas-psikolog.webp',
    accent: 'var(--orange)',
    profileText: 'KODİL ekibinde psikolog olarak yer alır.',
  },
  {
    slug: 'ahsen-sultan-kaynak',
    name: 'Ahsen Sultan KAYNAK',
    role: 'Psikolog',
    image: '/images/team/ahsen-sultan-kaynak-psikolog.webp',
    accent: 'var(--orange)',
    profileText: 'KODİL ekibinde psikolog olarak yer alır.',
  },
  {
    slug: 'nilgun-gorum',
    name: 'Nilgün GÖRÜM',
    role: 'Asistan',
    image: '/images/team/nilgun-gorum-asistan.webp',
    accent: 'var(--turquoise)',
    profileText: 'KODİL ekibinde asistan olarak yer alır.',
  },
]

export function getTeamMember(slug: string) {
  return teamMembers.find((member) => member.slug === slug)
}

export function teamProfilePath(member: Pick<TeamMember, 'slug'>) {
  return `/ekibimiz/${member.slug}`
}
export function personId(member: Pick<TeamMember, 'slug'>) {
  return `${absoluteUrl(teamProfilePath(member))}#person`
}
export function hasVerifiedExpertise(member: TeamMember) {
  return (member.verifiedExpertise ?? []).length > 0
}
