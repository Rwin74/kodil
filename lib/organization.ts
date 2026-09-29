export interface VerifiedOrganizationFact<T> {
  value: T
  sourceReference: string
  verifiedIsoDate: string
}

export interface OrganizationProfile {
  foundingYear?: VerifiedOrganizationFact<number>
  founderStory?: VerifiedOrganizationFact<string>
  totalExperienceYears?: VerifiedOrganizationFact<number>
  teamStructure: readonly {
    title: string
    description: string
  }[]
  expertiseAreas: readonly {
    name: string
    description: string
    href: string
  }[]
  approach: readonly {
    title: string
    description: string
  }[]
}

/**
 * Kuruluş yılı, kurucu hikâyesi ve toplam deneyim yalnızca doğrulanabilir bir
 * kaynakla birlikte eklenebilir. Repoda bu kaynaklar bulunmadığı için bu üç
 * alan yayına verilmemiştir; beklenen veriler docs/FAZ-2-VERI-GEREKSINIMLERI.md
 * dosyasında listelenir.
 */
export const organizationProfile: OrganizationProfile = {
  teamStructure: [
    {
      title: 'Dil ve konuşma terapisi',
      description: 'Dil ve konuşma terapisti unvanıyla listelenen ekip üyeleri.',
    },
    {
      title: 'Ergoterapi',
      description: 'Ergoterapist unvanıyla listelenen ekip üyesi.',
    },
    {
      title: 'Psikoloji',
      description: 'Psikolog unvanıyla listelenen ekip üyeleri.',
    },
    {
      title: 'Danışan koordinasyonu',
      description: 'Randevu ve merkez iletişimini destekleyen ekip rolü.',
    },
  ],
  expertiseAreas: [
    {
      name: 'Dil ve konuşma terapisi',
      description: 'Dil, konuşma, ses, akıcılık ve iletişim konularındaki içerik ve hizmet başlığı.',
      href: '/kimlere-yardimci-oluyoruz',
    },
    {
      name: 'Ergoterapi',
      description: 'Duyusal süreçler ve günlük yaşam becerilerine ilişkin içerik ve hizmet başlığı.',
      href: '/blog/kocaeli-ergoterapi',
    },
    {
      name: 'Psikolojik destek',
      description: 'Sitede psikolog ekip rolleriyle temsil edilen çalışma başlığı.',
      href: '/ekibimiz',
    },
  ],
  approach: [
    {
      title: 'İhtiyacı anlama',
      description: 'Danışanın ve ailenin ihtiyaçlarını dinleyerek süreci tanımlama.',
    },
    {
      title: 'Bireysel planlama',
      description: 'Belirlenen ihtiyaçlara göre izlenebilir bir yol haritası oluşturma.',
    },
    {
      title: 'Aileyle iletişim',
      description: 'Süreç boyunca geri bildirim ve günlük yaşama aktarım için aileyle temas kurma.',
    },
  ],
}

function verifiedValue<T>(fact: VerifiedOrganizationFact<T> | undefined, label: string) {
  if (!fact) return undefined
  if (fact.sourceReference.trim().length < 3) {
    throw new Error(`${label}: doğrulama kaynağı referansı gerekli.`)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fact.verifiedIsoDate)) {
    throw new Error(`${label}: doğrulama tarihi YYYY-MM-DD biçiminde olmalı.`)
  }
  if (typeof fact.value === 'string' && fact.value.trim().length < 20) {
    throw new Error(`${label}: doğrulanmış metin eksik.`)
  }
  if (typeof fact.value === 'number' && (!Number.isFinite(fact.value) || fact.value <= 0)) {
    throw new Error(`${label}: doğrulanmış sayısal değer geçersiz.`)
  }
  return fact.value
}

/** Kaynak ve tarih kontrollerinden geçmeden kurumsal geçmiş yayına çıkamaz. */
export const verifiedOrganizationHistory = {
  foundingYear: verifiedValue(organizationProfile.foundingYear, 'Kuruluş yılı'),
  founderStory: verifiedValue(organizationProfile.founderStory, 'Kurucu hikâyesi'),
  totalExperienceYears: verifiedValue(organizationProfile.totalExperienceYears, 'Toplam deneyim'),
}
