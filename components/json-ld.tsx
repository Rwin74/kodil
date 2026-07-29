export function JsonLd() {
  const clinicData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: 'KODİL — Kocaeli Dil ve Konuşma Terapisi Merkezi',
    alternateName: 'Kocaeli Dil ve Konuşma Terapisti',
    url: 'https://kocaelidilvekonusma.com',
    logo: 'https://kocaelidilvekonusma.com/images/logo.png',
    description: 'En iyi Kocaeli dil ve konuşma terapisti uzmanlarımızla yanınızdayız. KODİL, apraksi, duyusal hassasiyet, duyu bütünleme ve konuşma bozuklukları için çocuk odaklı gelişim merkezidir.',
    keywords: 'kocaeli dil ve konuşma, kocaeli dil ve konuşma terapisti, kocaeli dil terapisti, kocaeli ergoterapi',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Altek Plaza, Dumlupınar, Şht. Turgut Çiçek Cad. D:3. Kat B12',
      addressLocality: 'Kartepe',
      addressRegion: 'Kocaeli',
      postalCode: '41250',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '40.7505',
      longitude: '30.0232',
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

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Çocuğum geç konuşuyor, ne yapmalıyım? Beklemeli miyim?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Geç konuşma ihtmal edilmemesi gereken bir durumdur. Bekleyelim geçer yaklaşımı yerine Kocaeli dil ve konuşma terapisti uzmanlarımız tarafından yapılacak erken bir değerlendirme ile çocuğun dil gelişimi hızla desteklenebilir.'
        }
      },
      {
        '@type': 'Question',
        name: 'Konuşma terapisine kaç yaşında başlanır?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Dil ve konuşma terapisine her yaşta başlanabilir. Kocaeli de hizmet veren merkezimizde genellikle 2 yaşından itibaren değerlendirme yapılmaktadır. Erken müdahale, kalıcı sonuçlar almanın en etkili yoludur.'
        }
      },
      {
        '@type': 'Question',
        name: 'Çocuğum söylenenleri anlıyor ama konuşmuyor, nedeni nedir?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Bu durum, alıcı dil (anlama) gelişiminin iyi, ancak ifade edici dilin (konuşma) zayıf olmasından kaynaklanabilir. Kocaeli dil ve konuşma terapisi seanslarımızda bu alanlar ayrı ayrı değerlendirilerek iletişimi güçlendirecek özel bir yol haritası çizilir.'
        }
      },
      {
        '@type': 'Question',
        name: 'Kekemelik geçer mi? Terapisi nasıl uygulanır?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Kekemelik, çocuklarda doğru terapi ile çok büyük oranda kontrol altına alınabilir. Kocaeli kekemelik terapisi alan bireylerde akıcılık artarken konuşma kaygısı azalır. Erken yaşta başlanan doğru terapi planı ile günlük yaşama etki en aza indirilir.'
        }
      },
      {
        '@type': 'Question',
        name: 'Duyu bütünleme bozukluğu belirtileri nelerdir?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Aşırı hareketlilik, sese/dokunmaya hassasiyet, dikkat sorunları ve sakarlıklar başlıca belirtilerdir. Kocaeli ergoterapi merkezimizde uyguladığımız duyu bütünleme terapisi ile bu belirtiler azaltılarak çocuğun okul ve yaşam uyumu artırılır.'
        }
      },
      {
        '@type': 'Question',
        name: 'Konuşma terapisi oyunla mı yapılır?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Evet, özellikle çocuklarda dil ve konuşma terapisi tamamen oyun temelli uygulanır. Kocaelideki merkezimizde çocukların ilgisini çeken, onların dünyasına inen oyunlarla öğrenme süreci çok daha keyifli ve etkili hale getirilir.'
        }
      },
      {
        '@type': 'Question',
        name: 'Çocuğum bazı harfleri (R, S, K vb.) söyleyemiyor, ne yapmalıyım?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Artikülasyon bozukluğu olarak adlandırılan bu durum, seslerin yanlış veya eksik üretilmesidir. Kocaeli dil terapisti uzmanlarımızın uyguladığı bireysel terapi programlarıyla anlaşılamayan konuşma becerisi hızla düzeltilir.'
        }
      },
      {
        '@type': 'Question',
        name: 'Terapi seansları ne kadar sürer ve ne sıklıkla gelinmelidir?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Süreç tamamen bireyin ihtiyacına ve terapiye verdiği yanıta göre değişir. Kocaelideki merkezimizde yapılan ön değerlendirme sonrası genellikle haftada 1 veya 2 seans önerilir. Düzenli takip, kalıcı gelişim sağlamak için kritiktir.'
        }
      },
      {
        '@type': 'Question',
        name: 'Kocaeli dil ve konuşma terapisi veya ergoterapi randevusu nasıl alınır?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sitemizdeki iletişim formu, WhatsApp veya telefon numaramız üzerinden bizimle iletişime geçerek ön değerlendirme randevusu oluşturabilirsiniz. Uzman değerlendirmesiyle çocuğunuza en uygun planı hemen hazırlıyoruz.'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  )
}
