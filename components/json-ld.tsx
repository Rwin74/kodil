export function JsonLd() {
  const clinicData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'KODİL Kocaeli Dil, Konuşma ve Ergoterapi Merkezi',
    url: 'https://kocaelidilvekonusma.com',
    logo: 'https://kocaelidilvekonusma.com/images/logo.webp',
    description: 'Kartepe, Kocaeli’de dil ve konuşma terapisi ile ergoterapi alanlarında çalışan merkez.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dumlupınar Mahallesi, Şehit Turgut Çiçek Caddesi, Altek Plaza, 3. Kat, B12',
      addressLocality: 'Kartepe',
      addressRegion: 'Kocaeli',
      postalCode: '41250',
      addressCountry: 'TR',
    },
    telephone: '+905015640041',
    email: 'yardenegitim@gmail.com',
    sameAs: [
      'https://www.instagram.com/kocaelidilkonusmamerkezi/',
      'https://www.facebook.com/people/Kocaeli-Dil-Konu%C5%9Fma-ve-Ergoterapi-Merkezi/61581354345505/'
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '12:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '10:00',
        closes: '20:00',
      }
    ],
    availableService: [
      {
        '@type': 'MedicalTherapy',
        name: 'Dil ve Konuşma Terapisi',
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Ergoterapi',
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Apraksi Terapisi',
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Duyusal Hassasiyet ve Duyu Bütünleme',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicData) }}
      />
    </>
  )
}
