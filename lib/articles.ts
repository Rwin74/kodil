export interface ArticleImage {
  path: string
  alt: string
  caption: string
  context: string
  width?: number
  height?: number
}

export interface ArticleExperience {
  authorSlug: string
  providedIsoDate: string
  evidenceReference: string
  expertObservation?: string
  practiceApproach?: string
  commonSituations?: string
  realCaseStudyId?: string
  importantLimitations?: string
}

export interface Article {
  id: string
  slug: string
  title: string
  seoTitle?: string
  excerpt: string
  content: string
  date: string
  isoDate: string
  modifiedDate?: string
  modifiedIsoDate?: string
  image?: ArticleImage
  experience?: ArticleExperience
  category: string
  keywords: string[]
}

export const ARTICLE_SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 } as const

export function articleImagePath(article: Pick<Article, 'slug' | 'image'>) {
  return article.image?.path ?? `/blog/${article.slug}/social-image`
}
export function articleImageAlt(article: Pick<Article, 'title' | 'image'>) {
  return article.image?.alt ?? `${article.title} başlıklı KODİL bilgilendirici içerik görseli`
}
export function articleImageCaption(article: Pick<Article, 'title' | 'image'>) {
  return article.image?.caption ?? `${article.title} için hazırlanmış KODİL içerik görseli.`
}
export function articleImageContext(article: Pick<Article, 'image'>) {
  return article.image?.context ?? 'Başlık ve kategoriyi gösterir; bir vaka, danışan veya sağlık sonucu betimlemez.'
}

export const articles: Article[] = [
  {
    id: '1',
    slug: 'kocaeli-dil-ve-konusma-terapisti-neden-erken-mudahale',
    title: 'Kocaeli Dil ve Konuşma Terapisti: Neden Erken Müdahale?',
    excerpt: 'Çocuğunuzun dil ve iletişim gelişimiyle ilgili kaygınız varsa neler yapabilirsiniz? Kocaeli’de dil ve konuşma terapisi değerlendirmesi hakkında bilgi.',
    category: 'Dil Terapisi',
    date: '15 Tem 2026',
    isoDate: '2026-07-15',
    keywords: ['kocaeli dil ve konuşma terapisti', 'kocaeli dil terapisti', 'erken müdahale', 'dil ve konuşma terapisi kocaeli'],
    content: `
Çocuğunuzun konuşma veya dili anlama becerileriyle ilgili kaygınız varsa bunu çocuğunuzun doktoruyla paylaşın. Çocukların gelişim hızı farklıdır; çevrimiçi bir yazı ya da gelişim basamağı listesi tanı koyamaz. CDC, ailelerin kaygılarını doktorla paylaşmasını ve gerektiğinde gelişim taraması ya da ileri değerlendirme istemesini önerir.

### İlk olarak ne yapabilirsiniz?
Çocuğunuzun doktoruna hangi durumların sizi kaygılandırdığını örneklerle anlatın. İsterseniz gözlemlerinizi ve çocuğunuzun günlük iletişiminden örnekleri not edin. Doktor, gelişim taraması veya başka bir uzman değerlendirmesi gerekip gerekmediğini sizinle görüşebilir. Dil ve konuşma terapisti de çocuğun iletişim, dili anlama ve dili kullanma becerilerini değerlendirebilir.

### Kocaeli’de dil ve konuşma terapisti arıyorsanız
KODİL, Kartepe/Kocaeli’de çocuk ve yetişkinler için dil ve konuşma terapisi hizmeti sunar. Görüşmede başvuru nedeni, değerlendirme süreci, hedefler ve randevu koşulları hakkında soru sorabilirsiniz. Her çocuğun ihtiyacı farklı olduğundan, uygun hizmet ve izlenecek yol bireysel değerlendirmeyle belirlenir.

Konuşma kaygısına başka gelişimsel veya sağlıkla ilgili gözlemler eşlik ediyorsa bunları çocuğunuzun doktoruyla paylaşın. Duyusal tepkiler çocuğun günlük yaşamını etkiliyorsa doktorla ve ergoterapi uzmanıyla ayrıca görüşülebilir; tek bir belirti belirli bir tanı veya hizmetin gerekli olduğunu göstermez.

Genel aile bilgisi için [CDC’nin gelişiminden kaygı duyulan durumlara yönelik rehberini](https://www.cdc.gov/act-early/families/concerned.html) ve [ASHA’nın geç dil gelişimi değerlendirmesi hakkındaki açıklamasını](https://www.asha.org/Practice-Portal/Clinical-Topics/Late-Language-Emergence/) inceleyebilirsiniz. KODİL’in [ekip bilgileri](/ekibimiz), [Kartepe adresi ve randevu seçenekleri](/kocaeli-dil-ve-konusma-terapisi) de sitede yer alır.
    `
  },
  {
    id: '2',
    slug: 'apraksi-nedir-belirtileri-ve-tedavisi',
    title: 'Apraksi Nedir? Çocuklarda Konuşma Apraksisi',
    excerpt: 'Apraksi nedir, çocuklarda konuşma apraksisi nasıl anlaşılır ve tedavi sürecinde ebeveynler neler yapmalıdır?',
    category: 'Konuşma Terapisi',
    date: '10 Tem 2026',
    isoDate: '2026-07-10',
    keywords: ['apraksi', 'apraksi nedir', 'konuşma apraksisi', 'apraksi tedavisi'],
    content: `
Çocuğunuz konuşmakta zorlanıyor veya aynı sözcüğü farklı zamanlarda farklı söylüyorsa, bu gözlemler tek başına çocukluk çağı konuşma apraksisi tanısı koydurmaz. Konuşma üretimindeki güçlüklerin farklı nedenleri olabilir; değerlendirme için çocuk doktoruna ve dil ve konuşma terapistine danışın.

### Değerlendirme nasıl ilerler?
Dil ve konuşma terapisti çocuğun konuşma üretimini ve iletişim becerilerini değerlendirir; öykü, gözlem ve uygun değerlendirme araçlarını kullanabilir. İşitme veya genel gelişim hakkında kaygı varsa çocuk doktoruyla paylaşılmalıdır. Aileler [CDC gelişim rehberini](https://www.cdc.gov/act-early/families/concerned.html) ve [ASHA geç dil gelişimi açıklamasını](https://www.asha.org/Practice-Portal/Clinical-Topics/Late-Language-Emergence/) da inceleyebilir.

### Kocaeli’de nereden bilgi alınır?
KODİL, Kartepe’de dil ve konuşma terapisi hizmeti sunar. Çocuğunuza uygun değerlendirme ve yaklaşım için randevu öncesinde merkezle görüşün; tanı veya sonuç garantisi çevrimiçi içerikten verilemez. Merkezin [ekibi ve yayımlanmış görev bilgileri](/ekibimiz), [adres ve iletişim bilgileri](/kocaeli-dil-ve-konusma-terapisi) incelenebilir.
    `
  },
  {
    id: '3',
    slug: 'duyusal-hassasiyet-ve-duyu-butunleme',
    title: 'Duyusal Hassasiyet Nedir? Duyu Bütünleme Terapisi',
    excerpt: 'Ses, dokunma veya yemek dokularına verilen tepkiler çocuğun günlük yaşamını etkiliyorsa aileler hangi uzmanlarla görüşebilir? Kocaeli ergoterapi bilgisi.',
    category: 'Ergoterapi',
    date: '05 Tem 2026',
    isoDate: '2026-07-05',
    keywords: ['duyusal hassasiyet', 'duyusal hassasiyet nedir', 'duyu hassasiyeti', 'duyu hassasiyeti nedir', 'hassasiyet nedir', 'duyu bütünleme'],
    content: `
Bazı çocuklar ses, ışık, dokunma, kıyafet veya yemek dokuları konusunda güçlü tercihler gösterebilir. Tek bir tepki, tanı veya “duyu bütünleme bozukluğu” olduğu anlamına gelmez. Öncelikle bu durumun çocuğun günlük yaşamına nasıl etki ettiğini gözlemleyin ve kaygınızı çocuk doktoruyla paylaşın.

### Aileler neleri not edebilir?
Hangi ses, dokunma, giysi veya yemek durumlarında zorlanma görüldüğünü; ne kadar sık olduğunu ve giyinme, yemek, oyun, uyku veya okul gibi günlük etkinliklere etkisini not edin. Bu gözlemler doktorla veya ilgili uzmanla yapılacak görüşmeye yardımcı olabilir.

Bu gözlemler tek başına konuşma veya başka bir gelişimsel durumun nedenini göstermez. Konuşma ve dil konusunda ayrıca kaygı varsa çocuğun doktoruna ve dil ve konuşma terapistine danışın.

### Ergoterapi ne zaman konuşulabilir?
Bir ergoterapist, çocuğun günlük yaşam etkinliklerine katılımıyla ilgili ihtiyaçları değerlendirebilir. Ergoterapi görüşmesinin uygun olup olmadığı çocuğun durumuna ve uzman değerlendirmesine bağlıdır; bu içerik tanı koymaz veya terapi sonucu vaat etmez. KODİL, Kartepe/Kocaeli’de ergoterapi hizmeti sunar. [Hizmet ve randevu bilgileri](/kocaeli-dil-ve-konusma-terapisi) için merkezle görüşebilirsiniz.
    `
  },
  {
    id: '4',
    slug: 'dil-edinimi-ne-zaman-baslar',
    title: 'Dil Edinimi Ne Zaman Başlar? Gelişim Tablosu',
    excerpt: 'Çocuklarda dil edinimi ne zaman başlar? Bebeklikten çocukluğa dil ve konuşma becerilerinin aylara göre gelişim evreleri.',
    category: 'Çocuk Gelişimi',
    date: '02 Tem 2026',
    isoDate: '2026-07-02',
    keywords: ['dil edinimi ne zaman başlar', 'çocuk gelişimi', 'dil gelişimi', 'kocaeli dil konuşma'],
    content: `
Dil ve iletişim gelişimi doğumdan itibaren çevreyle kurulan etkileşim içinde ilerler. Çocukların becerileri farklı zamanlarda gelişebilir; yaş basamakları gelişim hakkında konuşmaya yardımcı olur ancak tanı aracı değildir.

### Bebeklik Döneminde Dil Gelişimi
Bebekler doğdukları andan itibaren çevredeki sesleri, özellikle anne ve babalarının ses tonunu analiz etmeye başlarlar. 
* **0-3 Ay:** Ağlama, gülümseme ve rastgele sesler çıkarma dönemi. İletişimin temeli bu aylarda atılır.
* **4-6 Ay:** Babıldama dönemi. "Ba-ba", "ma-ma" gibi ünlü-ünsüz hecelerin tekrarları başlar.
* **7-12 Ay:** Jargon dediğimiz, kendi dillerinde melodili ama anlamsız uzun konuşmalar yaparlar. Genellikle 1 yaş civarı ilk anlamlı kelimeler (anne, baba, su, ver vb.) duyulur.

Çocuğunuzun iletişim becerileri hakkında kaygınız varsa doktoruyla paylaşın. Tek bir gelişim basamağının gecikmesi belirli bir konuşma bozukluğu olduğu anlamına gelmez.

### Gecikme Durumunda Ne Yapılmalı?
Çocuğunuzun iletişim gelişimiyle ilgili sorunuz varsa yaşını, kullandığı sözcük ve jest örneklerini, dili nasıl anladığına dair gözlemlerinizi not ederek doktoruna danışabilirsiniz. Dil ve konuşma terapisti değerlendirmesi konusunda da bilgi alabilirsiniz. KODİL’in [Kartepe/Kocaeli hizmet ve iletişim bilgileri](/kocaeli-dil-ve-konusma-terapisi) mevcuttur. Kaygınız varsa bunu çocuğun doktoruyla paylaşın.
    `
  },
  {
    id: '5',
    slug: 'granulom-nedir-ses-teli-nodulu',
    title: 'Granülom Nedir? Ses Teli Rahatsızlıkları',
    excerpt: 'Ses kısıklığına neden olan granülom nedir? Yetişkinlerde ve çocuklarda ses teli nodülü ve granülom tedavisi.',
    category: 'Konuşma Terapisi',
    date: '28 Haz 2026',
    isoDate: '2026-06-28',
    keywords: ['granülom nedir', 'ses teli', 'ses kısıklığı', 'ses terapisi'],
    content: `
Uzun süreli ses kısıklığı, boğazda takılma hissi ve seste yorulma şikayetleriyle başvuran hastalarımızın merak ettiği konulardan biri de "granülom nedir" sorusudur. Granülom, ses tellerinin (vokal kordların) arka kısmında, kıkırdak yapının üzerinde genellikle travma veya tahriş sonucu oluşan iyi huylu doku büyümeleridir.

### Neden Olur?
* Sürekli bağırmak, boğaz temizlemek veya yüksek sesle konuşmak (Vokal travma)
* Mide asidinin yemek borusundan yukarı kaçarak ses tellerini tahriş etmesi (Laringofaringeal reflü)
* Entübasyon (Ameliyat sırasında nefes borusuna tüp yerleştirilmesi) sonrası oluşan zedelenmeler.

### Ses Terapisi ile Tedavi
Granülom tedavisinde genellikle ilk aşamada cerrahi yerine ses terapisi ve reflü yönetimi önerilir. [Kocaeli dil ve konuşma terapisti](/blog/kocaeli-dil-ve-konusma-terapisti-neden-erken-mudahale) merkezimizde, ses teli üzerindeki baskıyı azaltacak doğru nefes teknikleri, sesi yumuşak başlatma egzersizleri ve ses hijyeni eğitimleri vererek granülomun küçülmesini ve kaybolmasını sağlıyoruz.

Eğer çocuğunuzda veya sizde inatçı bir ses kısıklığı varsa [uzman ekibimizden](/ekibimiz) destek almak için [bize ulaşabilirsiniz](/iletisim).
    `
  },
  {
    id: '6',
    slug: 'kocaeli-kekemelik-tedavisi-akici-konusma',
    title: 'Kocaeli Kekemelik Tedavisi: Akıcı Konuşma Mümkün mü?',
    excerpt: 'Çocuklarda ve yetişkinlerde kekemelik tedavisi nasıl yapılır? Kocaeli kekemelik terapisi merkezimizde akıcılık şekillendirme yöntemleri.',
    category: 'Kekemelik',
    date: '17 Tem 2026',
    isoDate: '2026-07-17',
    keywords: ['kocaeli kekemelik', 'kekemelik tedavisi', 'çocuklarda kekemelik', 'akıcı konuşma'],
    content: `
Kekemelikte konuşma sırasında ses veya hece tekrarları, uzatmalar ya da konuşma blokları görülebilir. Çocuğunuzun konuşmasındaki değişiklikler hakkında kaygınız varsa, gözlemlerinizi çocuk doktoruyla ve dil ve konuşma terapistiyle paylaşın. Yalnızca kısa bir anlatımdan kekemeliğin seyri veya destek ihtiyacı belirlenemez.

### Dil ve konuşma terapisti nasıl yardımcı olabilir?
Dil ve konuşma terapisti konuşma akıcılığını değerlendirip aileyle birlikte uygun destek seçeneklerini görüşebilir. Yaklaşım çocuğun yaşına, deneyimine ve ihtiyacına göre değişir; akıcılığın nasıl değişeceği veya seans sayısı önceden garanti edilemez. KODİL, Kartepe/Kocaeli’de dil ve konuşma terapisi sunar. [Ekip, adres ve randevu bilgileri](/kocaeli-dil-ve-konusma-terapisi) sayfasını inceleyin.
    `
  },
  {
    id: '7',
    slug: 'cocugum-konusmuyor-ne-zaman-uzmana-basvurmaliyim',
    title: 'Çocuğum Konuşmuyor, Ne Zaman Uzmana Başvurmalıyım?',
    excerpt: 'Çocuğunuz konuşmuyorsa veya iletişimiyle ilgili kaygınız varsa ilk adımlar, çocuk doktoru ve dil ve konuşma terapisti değerlendirmesi.',
    category: 'Dil Terapisi',
    date: '16 Tem 2026',
    isoDate: '2026-07-16',
    keywords: ['çocuğum konuşmuyor', 'konuşma gecikmesi', 'geç konuşma', 'kocaeli dil terapisti'],
    content: `
Çocuğunuz henüz konuşmuyorsa veya iletişim biçimi hakkında kaygınız varsa, gözleminizi çocuğun doktoruyla paylaşın. “Bekleyip görelim” kararından emin değilseniz, hangi gelişim taraması ya da uzman değerlendirmesinin uygun olacağını sorun. Her çocuğun gelişimi farklıdır ve bu sayfa tanı koyamaz.

### Hangi adımlar yardımcı olabilir?
* Çocuğunuzun günlük iletişiminden örnekleri ve sizi kaygılandıran durumları not edin.
* Çocuğun doktorundan gelişim taraması ve gerekirse ileri değerlendirme hakkında bilgi alın.
* Konuşma ve dili anlama becerileri için dil ve konuşma terapisti değerlendirmesi sorun. İşitmeyle ilgili bir kaygınız varsa bunu da doktorla paylaşın.

CDC, gelişim kaygılarının çocuğun doktoruyla paylaşılmasını önerir; basamak listeleri tanı aracı değildir. Genel bilgi için [CDC rehberini](https://www.cdc.gov/act-early/families/concerned.html) ve [ASHA’nın geç dil gelişimi değerlendirme açıklamasını](https://www.asha.org/Practice-Portal/Clinical-Topics/Late-Language-Emergence/) okuyabilirsiniz. KODİL, Kartepe/Kocaeli’de dil ve konuşma terapisi hizmeti sunar; [adres ve randevu bilgileri](/kocaeli-dil-ve-konusma-terapisi) sayfamızdadır.
    `
  },
  {
    id: '8',
    slug: 'artikulasyon-bozuklugu-nedir-harfleri-soyleyememe',
    title: 'Artikülasyon Bozukluğu (Harfleri Söyleyememe) Nedir?',
    excerpt: 'Çocuğunuz "R", "S" veya "K" gibi harfleri söyleyemiyor mu? Artikülasyon bozukluğu nedir ve konuşma terapisinde nasıl tedavi edilir?',
    category: 'Konuşma Terapisi',
    date: '16 Tem 2026',
    isoDate: '2026-07-16',
    keywords: ['artikülasyon bozukluğu', 'harfleri söyleyememe', 'r harfi söyleyememe', 'pelteklik'],
    content: `
Çocuğunuz bazı konuşma seslerini farklı üretiyor veya konuşması anlaşılmakta zorlanıyorsa, bu tek başına bir tanı anlamına gelmez. Konuşma seslerinin gelişimi yaşa ve bireye göre değişebilir; kaygınızı çocuk doktoruyla ve dil ve konuşma terapistiyle görüşün.

### Neden Olur ve Nasıl Düzelir?
Bir dil ve konuşma terapisti çocuğun konuşma seslerini ve anlaşılabilirliğini değerlendirebilir. İşitme, dil gelişimi veya başka bir sağlık alanıyla ilgili kaygı varsa çocuk doktoru uygun yönlendirmeyi yapabilir. Çevrimiçi örneklerden tanı koymak veya çocuğa egzersiz seçmek doğru değildir.

KODİL, Kartepe’de dil ve konuşma terapisi hizmeti sunar. Değerlendirme, hedefler ve aile katılımı hakkında bilgi için [ekibimizle](/ekibimiz) görüşebilir veya [iletişim sayfamızı](/kocaeli-dil-ve-konusma-terapisi) ziyaret edebilirsiniz.
    `
  },
  {
    id: '9',
    slug: 'kocaeli-otizm-ve-dil-terapisi-yaklasimlarimiz',
    title: 'Kocaeli Otizm ve Dil Terapisi Yaklaşımlarımız',
    excerpt: 'Otizm tanısı veya gelişim kaygısı olan çocuklarda iletişim desteği; çocuk doktoru, tanı değerlendirmesi ve Kocaeli’de dil ve konuşma terapisi hakkında bilgi.',
    category: 'Otizm',
    date: '15 Tem 2026',
    isoDate: '2026-07-15',
    keywords: ['kocaeli otizm', 'otizm dil terapisi', 'otizm konuşma terapisi', 'otizm belirtileri'],
    content: `
Otizmle ilgili tanı ve değerlendirme, uygun nitelikteki sağlık uzmanlarınca çocuğun gelişim öyküsü ve kapsamlı değerlendirme birlikte ele alınarak yapılır. İsme tepki vermeme, göz teması veya konuşma gelişimindeki farklılıklar tek başına tanı koydurmaz. Kaygınızı çocuğun doktoruyla paylaşın.

### İletişim desteği hakkında
Dil ve konuşma terapisti, çocuğun iletişim ve dil becerilerini değerlendirebilir; destek hedefleri çocuğun ihtiyacına ve ailesiyle yapılan görüşmeye göre belirlenir. Ergoterapi değerlendirmesi, günlük etkinliklere katılımla ilgili ihtiyaçlar için ayrıca düşünülebilir. Bu hizmetler otizm tanısının yerine geçmez.

CDC, otizm tanısının gelişim öyküsü ve profesyonel davranış gözlemi gibi birden fazla bilgi kaynağına dayandığını ve tek bir aracın tanı için kullanılmaması gerektiğini belirtir: [CDC tanı bilgisi](https://www.cdc.gov/autism/hcp/diagnosis/index.html). KODİL, Kartepe/Kocaeli’de dil ve konuşma terapisi hizmeti sunar; [adres, hizmet ve randevu bilgileri](/kocaeli-dil-ve-konusma-terapisi) sayfamızdadır.
    `
  },
  {
    id: '10',
    slug: 'ses-terapisi-hangi-hastaliklarda-kullanilir',
    title: 'Ses Terapisi Hangi Hastalıklarda Kullanılır?',
    excerpt: 'Ses kısıklığı, nodül, polip ve mutasyonel falsetto tedavisinde ses terapisi uygulamaları. Kocaeli ses terapisi hizmetlerimiz.',
    category: 'Ses Terapisi',
    date: '14 Tem 2026',
    isoDate: '2026-07-14',
    keywords: ['ses terapisi', 'ses kısıklığı', 'ses teli nodülü', 'kocaeli ses terapisi'],
    content: `
Sesimiz, kişiliğimizin ve kimliğimizin en önemli yansımasıdır. Ancak öğretmenler, çağrı merkezi çalışanları, şarkıcılar gibi sesini profesyonel olarak kullanan kişilerde veya yanlış ses kullanımı sonucu herkeste çeşitli ses hastalıkları ortaya çıkabilir. 

### Ses Terapisi ile Tedavi Edilen Durumlar
Ses terapisi sadece bir şan eğitimi değildir; ses tellerinin anatomisine ve fizyolojisine yönelik tıbbi bir müdahaledir. Aşağıdaki durumlarda sıklıkla kullanılır:
* **Ses Teli Nodülleri ve Polipleri:** Seste çatallanma ve yorulmaya neden olur.
* **[Granülom](/blog/granulom-nedir-ses-teli-nodulu):** Reflü veya entübasyon sonrası oluşan tahrişler.
* **Ergenlik döneminde ses değişimi:** Ses değişimi kişiden kişiye farklılık gösterebilir. Süregelen sesle ilgili kaygıda önce KBB hekimine danışın; uygun görülürse ses terapisi hakkında bilgi alın. Seans sayısı veya sonuç önceden garanti edilemez.
* **Ses Teli Felci (Paralizi):** Tiroit ameliyatları sonrası veya viral enfeksiyonlara bağlı olarak gelişebilir.

Eğer 2 haftadan uzun süren bir ses kısıklığınız varsa, öncelikle bir KBB hekimine muayene olmalı, ardından ses hijyeni ve ses egzersizleri için [uzman dil ve konuşma terapistlerimizle](/ekibimiz) görüşmelisiniz.
    `
  },
  {
    id: '11',
    slug: 'kocaeli-dil-ve-konusma-terapisti-tavsiye',
    title: 'Kocaeli Dil ve Konuşma Terapisti Tavsiye: Uzman Seçerken Dikkat Edilmesi Gerekenler',
    excerpt: 'Kocaeli’de dil ve konuşma terapisti seçerken eğitim, değerlendirme yaklaşımı, aile katılımı ve randevu koşulları hakkında sorabileceğiniz sorular.',
    category: 'Dil Terapisi',
    date: '17 Tem 2026',
    isoDate: '2026-07-17',
    keywords: ['kocaeli dil ve konuşma terapisti tavsiye', 'kocaeli en iyi dil terapisti', 'izmit dil ve konuşma terapisti', 'kocaeli dil terapisti öneri'],
    content: `
Çocuğunuzun iletişim veya konuşma gelişimiyle ilgili kaygınız varsa Kocaeli’de uzman ararken eğitim, değerlendirme süreci ve hizmet koşulları hakkında doğrudan bilgi alın. Önce çocuk doktoruyla görüşmek de çocuğunuzun genel gelişimini ele almak için yararlı bir adımdır.

### Uzman Seçiminde Altın Kriterler
1. Görüşeceğiniz uzmanın eğitimini, mesleki unvanını ve çocuklarla çalışma alanını sorun; yayımlanan bilgileri ayrıca inceleyin.
2. Değerlendirmenin neleri kapsadığını, hedeflerin nasıl belirleneceğini ve ailenin sürece nasıl katılacağını sorun.
3. Seans sıklığı, ücret, iptal koşulları ve olası yönlendirmeler konusunda önceden bilgi alın. Bunlar ihtiyaca göre değişebilir.

KODİL, Kartepe/Kocaeli’de dil ve konuşma terapisi hizmeti sunar. Merkezin [yayımlanmış ekip bilgilerini](/ekibimiz), [hizmet ve iletişim sayfasını](/kocaeli-dil-ve-konusma-terapisi) inceleyebilir, randevu öncesi sorularınızı telefonla iletebilirsiniz.
    `
  },
  {
    id: '12',
    slug: 'kocaeli-disleksi-tedavisi-ve-okuma-yazma-guclugu',
    title: 'Kocaeli Disleksi Tedavisi: Özgül Öğrenme Güçlüğü (Disleksi) Nedir?',
    excerpt: 'Çocuğunuz okuma yazmada zorlanıyor mu? Kocaeli disleksi ve öğrenme güçlüğü tedavisi, belirtileri ve uyguladığımız özel eğitim yaklaşımları.',
    category: 'Özel Eğitim',
    date: '17 Tem 2026',
    isoDate: '2026-07-17',
    keywords: ['kocaeli disleksi', 'disleksi tedavisi', 'okuma yazma güçlüğü', 'özgül öğrenme güçlüğü', 'kocaeli dil ve konuşma terapisti'],
    content: `
Çocuğunuz harfleri karıştırıyor, b ile d'yi ters yazıyor veya yaşıtları akıcı okumaya geçmişken okumakta zorlanıyor mu? Kocaeli ve çevre ilçelerden velilerimizin en çok araştırdığı konulardan biri de disleksidir (Özgül Öğrenme Güçlüğü). 

### Disleksi Belirtileri Nelerdir?
* Harfleri veya sayıları ters yazma (p/q, b/d, 3/E gibi)
* Okurken kelimeleri atlama, satır kaybetme
* Yön kavramlarında (sağ-sol, dün-bugün) kafa karışıklığı
* Yaşına göre sınırlı kelime dağarcığı ve [konuşma gecikmesi](/blog/cocugum-konusmuyor-ne-zaman-uzmana-basvurmaliyim) geçmişi

### Kocaeli Disleksi Merkezimizde Neler Yapıyoruz?
Okuma ve yazma güçlüğünün nedenini bu belirtilerden tek başına belirlemek mümkün değildir. Çocuğun okulda zorlandığını düşünüyorsanız öğretmeni ve doktoruyla görüşerek uygun değerlendirme yollarını sorun. KODİL’in [yayımlanmış hizmet alanları](/kimlere-yardimci-oluyoruz) arasında dil ve konuşma terapisi, ergoterapi ve psikoloji bulunur; özel eğitim tanısı veya hizmeti sunduğu varsayılmamalıdır. Kocaeli’deki adres ve randevu bilgileri [buradadır](/kocaeli-dil-ve-konusma-terapisi).
    `
  },
  {
    id: '13',
    slug: 'izmit-dil-ve-konusma-terapisti',
    title: 'İzmit Dil ve Konuşma Terapisti: Çocuğunuz İçin En Yakın Uzman',
    excerpt: 'İzmit merkez ve çevre ilçelere hizmet veren KODİL Dil ve Konuşma Terapisi Merkezi. Artikülasyon, kekemelik ve apraksi tedavileri.',
    category: 'Merkezimiz',
    date: '18 Tem 2026',
    isoDate: '2026-07-18',
    keywords: ['izmit dil ve konuşma terapisti', 'izmit dil terapisti', 'kocaeli izmit konuşma terapisti', 'izmit ergoterapi'],
    content: `
Kocaeli'nin kalbi İzmit'te ikamet eden ailelerimiz sıklıkla "İzmit dil ve konuşma terapisti nerede bulabilirim?" şeklinde araştırmalar yapmaktadır. KODİL Kartepe'deki merkezi konumuyla İzmit, Başiskele ve Derince gibi bölgelere kolay ulaşım imkanı sunan tam teşekküllü bir gelişim merkezidir.

### İzmit ve Çevresi İçin Sunduğumuz Hizmetler
* **Artikülasyon Terapisi:** "R" veya "S" gibi [harfleri söyleyememe](/blog/artikulasyon-bozuklugu-nedir-harfleri-soyleyememe) durumlarında net ve anlaşılır konuşma eğitimi.
* **Kekemelik Terapisi:** Çocuklarda ve yetişkinlerde kanıta dayalı [akıcılık terapileri](/blog/kocaeli-kekemelik-tedavisi-akici-konusma).
* **Ses Terapisi:** Öğretmenler ve çağrı merkezi çalışanlarında görülen [ses teli nodülü ve granülom](/blog/granulom-nedir-ses-teli-nodulu) tedavisi.

İzmit dil terapisti arayışınızda çocuğunuzun gelişimini riske atmadan, alanında lisanslı ve tecrübeli [uzman kadromuzdan](/ekibimiz) destek alın. KODİL ailesi olarak sadece İzmit'e değil, tüm Kocaeli'ye en iyi standartlarda terapi sunmayı hedefliyoruz.
    `
  },
  {
    id: '14',
    slug: 'afazi-nedir-inme-felc-sonrasi-konusma-terapisi',
    title: 'Afazi Nedir? İnme (Felç) Sonrası Konuşma Kaybı Terapisi',
    excerpt: 'Beyin kanaması veya felç sonrası aniden gelişen konuşma kaybı (afazi) nedir? Kocaeli afazi ve konuşma terapisi süreci nasıl ilerler?',
    category: 'Nörolojik Bozukluklar',
    date: '18 Tem 2026',
    isoDate: '2026-07-18',
    keywords: ['afazi nedir', 'inme sonrası konuşma', 'felç sonrası konuşma', 'kocaeli afazi terapisi', 'kocaeli dil ve konuşma terapisti'],
    content: `
Eğer yakınınız yakın zamanda bir beyin kanaması, kafa travması veya iskemik inme (felç) geçirdiyse ve konuşma yetisini kısmen ya da tamamen kaybettiyse, bu duruma tıbbi olarak "Afazi" denir. Kocaeli dil ve konuşma terapisti merkezimizde yetişkin nörolojik vakalarda en çok karşılaştığımız hastalıklardan biridir.

### Afazi Belirtileri Nelerdir?
* Söylemek istediği kelimeyi bulamama (Anomi)
* Karşı tarafın söylediklerini anlamakta güçlük çekme (Wernicke Afazisi)
* Konuşmanın tamamen durması veya sadece birkaç hece üretebilme (Broca Afazisi)
* Okuma ve yazma becerilerinin bozulması

### İnme Sonrası Konuşma Terapisi Ne Zaman Başlamalı?
Afazi terapisinde en önemli faktör zamandır. İnme sonrası tıbbi durum stabil hale gelir gelmez (genellikle ilk birkaç hafta içinde) dil ve konuşma terapisine başlanmalıdır. Beynin "nöroplastisite" (yeniden şekillenme ve öğrenme) yeteneği ilk 6 ayda çok yüksektir.

Yetişkinlerde konuşma terapisi, tıpkı çocuklardaki [apraksi tedavisinde](/blog/apraksi-nedir-belirtileri-ve-tedavisi) olduğu gibi yoğun tekrar ve beyni yeniden programlama egzersizleri içerir. Hastanızın iletişim becerilerini yeniden kazanmasına yardımcı olmak için hemen [bize ulaşın](/iletisim).
    `
  },
  {
    id: '15',
    slug: 'gebze-dil-ve-konusma-terapisti',
    title: 'Gebze Dil ve Konuşma Terapisti Arayanlara Özel KODİL Yaklaşımı',
    excerpt: 'Gebze bölgesinden merkezimize gelen danışanlarımız için Kocaeli dil ve konuşma terapisti hizmetlerimiz ve ergoterapi destekleri.',
    category: 'Merkezimiz',
    date: '19 Tem 2026',
    isoDate: '2026-07-19',
    keywords: ['gebze dil ve konuşma terapisti', 'gebze ergoterapi', 'gebze konuşma terapisti', 'kocaeli dil ve konuşma terapisti'],
    content: `
Gebze, Darıca ve Çayırova bölgeleri Kocaeli'nin nüfus yoğunluğu en yüksek olan ve nitelikli sağlık profesyonellerine en çok ihtiyaç duyulan ilçeleridir. "Gebze dil ve konuşma terapisti" arayışında olan birçok ebeveyn, multidisipliner bir yaklaşım aradığı için Kartepe'deki KODİL Ergoterapi ve Dil Konuşma Merkezi'ni tercih etmektedir.

### Neden KODİL'i Tercih Etmelisiniz?
Birden fazla hizmetin gerekip gerekmediği çocuğun bireysel ihtiyaçlarına ve ilgili uzmanların değerlendirmesine bağlıdır. Bir hizmet diğerinin yerine geçmez ve bir arada sunulması daha hızlı ya da daha iyi sonuç garantisi vermez. Gebze’den başvuru düşünen aileler, KODİL’in Kartepe’deki konumunu ve randevu ayrıntılarını [iletişim sayfasından](/kocaeli-dil-ve-konusma-terapisi) inceleyip yolculuk ve uygunluk bilgisi alabilir.
    `
  },
  {
    id: '16',
    slug: 'cocugum-r-harfini-soyleyemiyor-ne-yapmaliyim',
    title: 'Çocuğum R Harfini Söyleyemiyor (Rotasizm) Ne Yapmalıyım?',
    excerpt: 'Çocuklarda R harfini söyleyememe (Rotasizm) problemi. Artikülasyon bozukluğunda dil terapisi kaç yaşında başlamalıdır?',
    category: 'Konuşma Terapisi',
    date: '19 Tem 2026',
    isoDate: '2026-07-19',
    keywords: ['r harfini söyleyememe', 'çocuğum r harfini söyleyemiyor', 'rotasizm', 'kocaeli dil ve konuşma terapisti', 'pelteklik tedavisi'],
    content: `
Çocukların dil gelişim sürecinde en son ve en zor edinilen ses genellikle "R" sesidir. Ailelerin "Çocuğum araba yerine ayaba diyor, r harfini söyleyemiyor" diyerek Kocaeli dil ve konuşma terapisti merkezimize başvurması oldukça yaygındır. R sesinin yanlış üretimine tıbbi olarak "Rotasizm" denilir ve bir tür [artikülasyon bozukluğudur](/blog/artikulasyon-bozuklugu-nedir-harfleri-soyleyememe).

### R Sesini Söyleyememe Ne Zaman Sorun Teşkil Eder?
Genel kural olarak çocukların 5 yaşına kadar R sesini üretememesi normal karşılanabilir. Ancak çocuk ilkokula (okuma-yazma sürecine) başlamak üzereyse ve hala R harfini üretemiyorsa, bu durum;
1. Okurken R harfini gördüğünde farklı bir ses (Y veya L) okumasına,
2. Yazarken yanlış kodlamasına (Örn: "Resim" yerine "Yesim" yazması)
3. Akran zorbalığına maruz kalarak özgüven kaybı yaşamasına neden olabilir.

Konuşma seslerinin değerlendirilmesi ve destek hedefleri çocuğun yaşına, konuşma özelliklerine ve ihtiyaçlarına göre dil ve konuşma terapisti tarafından belirlenir. Belirli bir sesi ne kadar sürede öğreneceğine dair genel süre veya kalıcı sonuç garantisi verilemez. KODİL’in [ekip ve randevu bilgileri](/kocaeli-dil-ve-konusma-terapisi) için merkezle görüşebilirsiniz.
    `
  },
  {
    id: '17',
    slug: 'kocaeli-yutma-bozukluklari-terapisi-disfaji',
    title: 'Kocaeli Yutma Bozuklukları Terapisi (Disfaji) Nedir?',
    excerpt: 'Bebeklerde, yaşlılarda veya nörolojik hastalıklarda görülen yutma güçlüğü (Disfaji) nedir? Kocaeli yutma terapisi süreçleri.',
    category: 'Yutma Bozuklukları',
    date: '20 Tem 2026',
    isoDate: '2026-07-20',
    keywords: ['yutma bozukluğu', 'disfaji', 'kocaeli yutma terapisi', 'kocaeli dil ve konuşma terapisti', 'bebeklerde yutma güçlüğü'],
    content: `
Toplumda çok az bilinse de, yutma bozukluklarının (Disfaji) değerlendirilmesi ve terapisi, Dil ve Konuşma Terapistlerinin en hayati uzmanlık alanlarından biridir. Yutma işlevini gerçekleştiren kaslar ile konuşmayı sağlayan kaslar aynıdır. Bu yüzden Kocaeli dil ve konuşma terapisti arayışınız aynı zamanda Kocaeli yutma terapisi arayışınızı da karşılar.

### Yutma Bozukluğu (Disfaji) Kimlerde Görülür?
* **Prematüre Bebeklerde:** Emme-yutma-nefes alma koordinasyonunu sağlayamayan bebeklerde,
* **Nörolojik Hastalarda:** ALS, Parkinson, MS hastalarında veya [inme (felç) geçirenlerde](/blog/afazi-nedir-inme-felc-sonrasi-konusma-terapisi),
* **Baş-Boyun Kanserlerinde:** Cerrahi müdahale sonrası veya radyoterapiye bağlı kas zayıflıklarında.

### Tedavi Edilmezse Ne Olur?
Yutma güçlüğü hafife alınacak bir durum değildir. Yiyecek veya içeceklerin yanlışlıkla nefes borusuna ve akciğerlere kaçması (Aspirasyon) hayati tehlike taşıyan zatürreye (Aspirasyon Pnömonisi) yol açabilir. 

KODİL'de yutma bozukluğu olan hastalarımıza özel postür (duruş) manevraları, kıvam artırıcı diyet modifikasyonları ve yutma kaslarını güçlendirici termal-taktil uyaran terapileri uygulanmaktadır. Detaylı değerlendirme için [bize ulaşabilirsiniz](/iletisim).
    `
  },
  {
    id: '18',
    slug: 'ergoterapi-merkezi-secerken-nelere-dikkat-edilmeli',
    title: 'Kocaeli Ergoterapi Merkezi Seçerken Nelere Dikkat Edilmeli?',
    excerpt: 'Kocaeli ergoterapi ve duyu bütünleme merkezi ararken doğru uzmanı nasıl bulursunuz? KODİL Ergoterapi farkı.',
    category: 'Ergoterapi',
    date: '20 Tem 2026',
    isoDate: '2026-07-20',
    keywords: ['kocaeli ergoterapi', 'kocaeli duyu bütünleme', 'ergoterapi merkezi', 'ergoterapist', 'kocaeli dil ve konuşma terapisti'],
    content: `
Tıpkı "Kocaeli dil ve konuşma terapisti" ararken gösterdiğiniz titizliği, çocuğunuz için "Kocaeli ergoterapi" merkezi seçerken de göstermeniz gerekir. Ergoterapi, çocuğun bağımsız yaşam becerilerini, motor planlamasını ve [duyusal hassasiyetlerini](/blog/duyusal-hassasiyet-ve-duyu-butunleme) düzenleyen son derece kritik bir sağlık disiplinidir.

### Ergoterapi Merkezi Seçim Kriterleri
1. **Lisanslı Ergoterapist Şartı:** Terapiyi uygulayan kişinin 4 yıllık Ergoterapi veya İş ve Uğraşı Terapisi lisans mezunu olması yasal bir zorunluluktur. KODİL bünyesinde [sadece lisans mezunu uzmanlar](/ekibimiz) görev yapar.
2. **Duyu Bütünleme Odasının Donanımı:** Salıncaklar, tırmanma duvarları, trambolinler, derin bası sağlayan materyallerin çocuğun güvenliğine uygun ve amaca yönelik tasarlanmış olması gerekir.
3. **Ekip iletişimi:** Birden fazla uzmanla çalışan aileler, gerekli olduğunda uzmanlar arasında nasıl bilgi paylaşılacağını ve bunun aile onayıyla nasıl yürütüleceğini sorabilir. Ekip çalışması belirli bir sonuç veya başarı oranı garantilemez.

KODİL olarak Kocaeli'de ergoterapi ve dil konuşma terapisini aynı çatı altında, en güçlü altyapı ile sunmaktan gurur duyuyoruz. Daha fazla bilgi almak için [hizmetlerimiz](/kimlere-yardimci-oluyoruz) sayfasını inceleyebilirsiniz.
    `
  },
  {
    id: '19',
    slug: 'dudak-damak-yarigi-sonrasi-konusma-terapisi',
    title: 'Dudak Damak Yarığı Sonrası Konuşma Terapisi Kocaeli',
    excerpt: 'Dudak damak yarığı ameliyatları sonrası konuşmada hımhımlık (hipernazalite) ve artikülasyon bozukluklarının tedavisi.',
    category: 'Konuşma Terapisi',
    date: '21 Tem 2026',
    isoDate: '2026-07-21',
    keywords: ['dudak damak yarığı', 'damak yarığı konuşma terapisi', 'hımhım konuşma', 'kocaeli dil ve konuşma terapisti'],
    content: `
Dudak damak yarığı (DDY), anne karnında yüz yapılarının tam birleşememesi sonucu oluşan anatomik bir farklılıktır. Doğum sonrası süreçte estetik ve fonksiyonel cerrahiler (plastik cerrahi) yapılsa da, ameliyatlardan sonra "Kocaeli dil ve konuşma terapisti" ihtiyacı son derece kritiktir.

### Neden Konuşma Terapisine İhtiyaç Duyulur?
Damak cerrahisi başarılı geçse dahi, çocuk o güne kadar damak kaslarını doğru kullanmayı öğrenemediği için iki temel sorun ortaya çıkar:
1. **Hipernazalite (Hımhım Konuşma):** Konuşurken havanın ağız yerine burundan kaçması sonucu sesin genizden gelmesidir.
2. **Kompansatuar Artikülasyon:** Çocuğun [harfleri söyleyememe](/blog/artikulasyon-bozuklugu-nedir-harfleri-soyleyememe) durumuna kendi kendine çözüm bulmaya çalışarak sesleri gırtlakta veya boğazda üretmeye başlamasıdır.

KODİL merkezimizde dudak damak yarığı olan çocuklarda velofaringeal kasları (damak arkası) güçlendirmeye ve doğru hava akışını sağlamaya yönelik yoğun terapiler uygulanmaktadır. Dudak damak yarığı multidisipliner bir ekiptir ve biz bu ekibin konuşma ayağında her zaman [yanınızdayız](/iletisim).
    `
  },
  {
    id: '20',
    slug: 'kocaeli-dil-ve-konusma-terapisti-seans-ucretleri',
    title: 'Kocaeli Dil ve Konuşma Terapisti Ücretleri ve Seans Süreçleri',
    excerpt: 'Kocaeli dil ve konuşma terapisti seans ücretleri ne kadar? Terapi süreci ne kadar sürer ve haftada kaç gün gelinmelidir?',
    category: 'Merkezimiz',
    date: '21 Tem 2026',
    isoDate: '2026-07-21',
    keywords: ['kocaeli dil ve konuşma terapisti ücretleri', 'dil terapisti seans ücretleri', 'konuşma terapisi fiyatları', 'kocaeli dil terapisti fiyat'],
    content: `
KODİL'e başvuran ailelerin aklında genellikle iki büyük soru işareti vardır: "Terapiler ne kadar sürecek?" ve "Kocaeli dil ve konuşma terapisti seans ücretleri ne kadar?" Bu soruların sabit bir cevabı olmamakla birlikte, şeffaf terapi prensibimiz gereği süreçleri detaylandırmak istiyoruz.

### Terapi Ne Kadar Sürer?
Terapinin süresi çocuğun tanısına, yaşına ve ailenin sürece katılımına bağlı olarak tamamen değişir. Bir [ses teli granülomu](/blog/granulom-nedir-ses-teli-nodulu) veya mutasyonel falsetto bazen 3-4 seansta çözülebilirken; [apraksi](/blog/apraksi-nedir-belirtileri-ve-tedavisi), şiddetli [kekemelik](/blog/kocaeli-kekemelik-tedavisi-akici-konusma) veya [otizm spektrum bozukluğu](/blog/kocaeli-otizm-ve-dil-terapisi-yaklasimlarimiz) durumlarında terapi aylar hatta yıllar sürebilir.

### Kocaeli Dil Terapisti Ücret Politikamız
Seans ücretleri, değerlendirme seansı ve standart takip seansları olarak farklılık gösterebilir. Uzman kadromuzun kıdemi ve spesifik uzmanlık alanları (örneğin yutma veya DIR Floortime) fiyatlandırmada etken olabilir. KODİL olarak amacımız, ulaşılabilir, sürdürülebilir ve en yüksek kalitede sağlık hizmetini sizlere sunmaktır.

Çocuğunuzun durumuna özel detaylı bilgi, değerlendirme süreci ve güncel seans ücretleri hakkında bilgi almak için randevu hattımız üzerinden [bizimle iletişime geçebilirsiniz](/iletisim).
    `
  },
  {
    id: '21',
    slug: 'hizli-bozuk-konusma',
    title: 'Hızlı Bozuk Konuşma (Taşifemi) Nedir?',
    excerpt: 'Çocuğunuz çok hızlı ve anlaşılamayan bir şekilde mi konuşuyor? Hızlı bozuk konuşma (Taşifemi) belirtileri ve tedavisi.',
    category: 'Konuşma Terapisi',
    date: '22 Tem 2026',
    isoDate: '2026-07-22',
    keywords: ['hızlı bozuk konuşma', 'taşifemi', 'anlaşılmaz konuşma', 'kocaeli dil terapisti', 'kocaeli konuşma bozukluğu'],
    content: `
Çocuğunuzun veya kendinizin çok hızlı konuştuğunu, kelimelerin birbirine girdiğini ve karşı tarafın "Ne dedin, yavaş söyler misin?" uyarısında bulunduğunu fark ediyor musunuz? Bu durum tıp dilinde "Taşifemi", halk arasında ise "Hızlı Bozuk Konuşma" olarak bilinir.

### Hızlı Bozuk Konuşma Belirtileri
* Aşırı hızlı ve düzensiz konuşma temposu
* Kelimelerin son hecelerini yutma veya atlama
* Konuşurken nefes nefese kalma
* Düşünce hızının, konuşma hızından daha yüksek olması (Ne söyleyeceğini düşünürken dilin yetişememesi)

Bu durum sıklıkla [kekemelik](/blog/kocaeli-kekemelik-tedavisi-akici-konusma) ile karıştırılır. Ancak kekemeliği olan bireyler konuştukları anın farkındayken, hızlı bozuk konuşması olan bireyler genellikle anlaşılmadıklarının farkında değillerdir. KODİL [dil ve konuşma terapisi](/blog/kocaeli-dil-ve-konusma-terapisti-neden-erken-mudahale) uzmanlarımız, metronom eşliğinde ritim terapileri ve hece farkındalığı çalışmalarıyla konuşma hızını kontrol altına almayı öğretmektedir. 
    `
  },
  {
    id: '22',
    slug: 'isitme-engelinde-eslik-eden-dil-ve-konusma-problemleri-nelerdir',
    title: 'İşitme Engelinde Eşlik Eden Dil ve Konuşma Problemleri Nelerdir?',
    excerpt: 'İşitme kaybı veya koklear implant kullanan çocuklarda görülen dil ve konuşma gecikmeleri. İşitsel rehabilitasyon süreçleri.',
    category: 'Özel Eğitim',
    date: '22 Tem 2026',
    isoDate: '2026-07-22',
    keywords: ['işitme engeli konuşma', 'koklear implant', 'işitsel rehabilitasyon', 'işitme kaybı konuşma terapisi', 'kocaeli özel eğitim'],
    content: `
Dil ediniminin en temel şartı "işitebilmektir." Çevresindeki sesleri, özellikle de insan sesini (konuşmayı) yeterince algılayamayan bir çocuğun konuşma üretmesi beklenemez. "İşitme engelinde eşlik eden dil ve konuşma problemleri nelerdir?" sorusu, özellikle yeni işitme cihazı veya koklear implant takılmış çocukların aileleri tarafından sıkça sorulmaktadır.

### En Sık Karşılaşılan Problemler
1. **Sözcük Dağarcığında Sınırlılık:** Çocuklar genellikle nesnelerin isimlerini öğrenmekte gecikirler. ([Dil Edinimi Tablosu](/blog/dil-edinimi-ne-zaman-baslar) referans alınabilir).
2. **Artikülasyon (Sesletim) Hataları:** Özellikle ince frekanslı sesleri (s, ş, f, h gibi) duyamadıkları için bu harfleri üretemezler. (Bkz: [Artikülasyon Bozukluğu](/blog/artikulasyon-bozuklugu-nedir-harfleri-soyleyememe))
3. **Gramatikal Hatalar:** Eklerin (çoğul ekleri, zaman ekleri) algılanması zor olduğu için cümle yapıları genellikle devriktir.

KODİL merkezimizde cihazlandırılmış çocuklar için İşitsel Sözel Terapi (Auditory Verbal Therapy) prensipleriyle yoğun bir işitsel rehabilitasyon programı uygulanır. Çocuğun sadece duyması değil, duyduğunu anlamlandırması ve konuşmaya dökmesi hedeflenir.
    `
  },
  {
    id: '23',
    slug: 'kocaeli-ergoterapi',
    title: 'Kocaeli Ergoterapi ve Duyu Bütünleme Merkezi',
    excerpt: 'Kocaeli Kartepe’de ergoterapi hizmeti ve çocukların günlük yaşam, oyun ve katılım ihtiyaçları hakkında bilgi.',
    category: 'Ergoterapi',
    date: '23 Tem 2026',
    isoDate: '2026-07-23',
    keywords: ['kocaeli ergoterapi', 'kocaeli duyu bütünleme', 'ergoterapist', 'izmit ergoterapi', 'kartepe ergoterapi'],
    content: `
Ergoterapi, kişinin günlük yaşam etkinliklerine ve toplumsal yaşama katılımını desteklemeye odaklanır. Bir çocuğun ihtiyaçları; yemek, giyinme, oyun, okul ve aile rutinleri gibi alanlarda görüşülebilir. KODİL, Kartepe/Kocaeli’de ergoterapi hizmeti sunar; hizmetin çocuğunuz için uygun olup olmadığını doğrudan uzmanla görüşün.

### Kocaeli Ergoterapi Merkezimizde Hangi Hizmetleri Sunuyoruz?
* Günlük yaşam etkinliklerine katılım ve aile rutinleri.
* Oyun, okul ve öz bakım etkinliklerinde karşılaşılan güçlüklerin değerlendirilmesi.
* İnce ve kaba motor becerilerle ilgili ihtiyaçların ele alınması.

Değerlendirme ve hedefler çocuğun ihtiyaçlarına göre belirlenir; belirli bir sonuç veya seans sayısı vaat edilemez. KODİL’in [ekip, adres ve randevu bilgileri](/kocaeli-dil-ve-konusma-terapisi) için merkezle iletişime geçebilirsiniz.
    `
  },
  {
    id: '24',
    slug: 'otizm-spektrum-bozuklugu-nedir-nedenleri-nelerdir',
    title: 'Otizmde Değerlendirme ve İletişim Desteği',
    excerpt: 'Otizm değerlendirmesi, gelişim kaygılarında doktorla görüşme ve tanı sonrası iletişim desteği hakkında ailelere genel bilgi.',
    category: 'Otizm',
    date: '23 Tem 2026',
    isoDate: '2026-07-23',
    keywords: ['otizm değerlendirmesi', 'otizmde iletişim desteği', 'çocuk gelişimi', 'kocaeli dil ve konuşma terapisi'],
    content: `
Otizm spektrum bozukluğuyla ilgili tanı ve değerlendirme, çocuğun gelişim öyküsü ile uzman değerlendirmesini birlikte ele alır. Tek bir davranış, kontrol listesi veya çevrimiçi yazı tanı koydurmaz. Gelişimle ilgili kaygınızı çocuğun doktoruyla paylaşın ve hangi tarama ya da değerlendirme gerektiğini sorun.

### Tanı ve destek hakkında
Gelişim taraması tanıdan farklıdır; tarama, daha ayrıntılı değerlendirme gerekip gerekmediğine karar vermeye yardımcı olabilir. CDC, otizm tanısının aile veya bakım verenlerden alınan gelişim öyküsü ile profesyonel gözlemi içeren bir değerlendirmeye dayandığını ve tek bir aracın tanı için yeterli olmadığını açıklar: [CDC tanı rehberi](https://www.cdc.gov/autism/hcp/diagnosis/index.html).

Otizm tanısı olsun veya olmasın, çocuğun iletişim ve günlük yaşam ihtiyaçları ayrıca ele alınabilir. Dil ve konuşma terapisi iletişim becerilerine; ergoterapi günlük etkinliklere katılıma odaklanabilir. KODİL, Kartepe/Kocaeli’de bu alanlarda hizmet sunar. Uygun hizmet ve süreç için çocuğunuzun doktoru ve ilgili uzmanlarla görüşün; KODİL’in [adres ve randevu bilgileri](/kocaeli-dil-ve-konusma-terapisi) sayfamızdadır.
    `
  },
  {
    id: '25',
    slug: 'psikoterapi-yontemleri-ve-uygulama-asamalari-nedir',
    title: 'Psikoterapi Yöntemleri ve Uygulama Aşamaları Nedir?',
    excerpt: 'Çocuk, ergen ve yetişkinlerde kullanılan psikoterapi yöntemleri nelerdir? Oyun terapisi, BDT ve terapi uygulama aşamaları.',
    category: 'Psikoloji',
    date: '24 Tem 2026',
    isoDate: '2026-07-24',
    keywords: ['psikoterapi yöntemleri', 'uygulama aşamaları', 'kocaeli psikolog', 'oyun terapisi', 'bdt'],
    content: `
KODİL çatısı altında sadece dil ve konuşma problemleriyle değil, çocukların ve ailelerin psikolojik iyi oluş haliyle de ilgileniyoruz. Terapilere başvuran ailelerin "Psikoterapi yöntemleri ve uygulama aşamaları nedir?" şeklinde haklı soruları olmaktadır.

### En Sık Uygulanan Psikoterapi Yöntemleri
1. **Çocuk Merkezli Oyun Terapisi:** 2-10 yaş arası çocukların travmalarını, kaygılarını ve davranış problemlerini "oyuncaklar" aracılığıyla ifade etmelerini sağlayan yöntemdir. Konuşma gecikmesi veya [kekemelik](/blog/kocaeli-kekemelik-tedavisi-akici-konusma) yaşayan çocuklarda ikincil olarak gelişen özgüven eksikliğinde çok etkilidir.
2. **Bilişsel Davranışçı Terapi (BDT):** Özellikle ergenlerde ve yetişkinlerde kaygı (anksiyete), depresyon ve sınav kaygısı gibi konularda düşünce sistemini yeniden yapılandırmayı hedefler.
3. **Ebeveyn Danışmanlığı:** [Otizm](/blog/otizm-spektrum-bozuklugu-nedir-nedenleri-nelerdir) veya [Özgül Öğrenme Güçlüğü](/blog/kocaeli-disleksi-tedavisi-ve-okuma-yazma-guclugu) tanısı alan çocukların ailelerine yönelik psiko-eğitim ve kabullenme sürecidir.

### Uygulama Aşamaları
Terapi süreci önce detaylı bir klinik değerlendirme (anamnez alma) ile başlar. Ardından bireye en uygun psikoterapi ekolü belirlenir ve düzenli seanslarla hedeflere ulaşılmaya çalışılır. Merkezimizdeki psikolojik danışmanlık hizmetleri hakkında bilgi almak için [bizimle iletişime geçebilirsiniz](/iletisim).
    `
  },
  {
    id: '26',
    slug: 'sesletim-artikulasyon-bozuklugu-nedir',
    title: 'Sesletim (Artikülasyon) Bozukluğu Nedir?',
    excerpt: 'Sesletim (Artikülasyon) bozukluğu nedir? Harfleri yanlış üretme, pelteklik ve R harfini söyleyememe durumlarında konuşma terapisi süreci.',
    category: 'Konuşma Terapisi',
    date: '24 Tem 2026',
    isoDate: '2026-07-24',
    keywords: ['sesletim bozukluğu nedir', 'artikülasyon bozukluğu', 'sesletim nedir', 'harfleri söyleyememe', 'kocaeli dil terapisti'],
    content: `
Çocuğunuz bazı sesleri çıkarırken zorlanıyor veya yerine başka sesler mi koyuyor? (Örneğin "Ayı" yerine "Ayi", "Sarı" yerine "Sayı"). Ebeveynlerin sıklıkla araştırdığı "Sesletim artikülasyon bozukluğu nedir?" sorusunun yanıtı, konuşma seslerinin dudak, dil, dişler ve damak gibi organlarla doğru biçimde şekillendirilememesidir.

Daha önceki yazılarımızda [artikülasyon bozukluğunun detaylarına](/blog/artikulasyon-bozuklugu-nedir-harfleri-soyleyememe) ve özellikle [R harfini söyleyememe (Rotasizm)](/blog/cocugum-r-harfini-soyleyemiyor-ne-yapmaliyim) konularına değinmiştik.

Sesletim bozukluğu olan bireylerin konuşma anlaşılırlığı düşüktür. Bu durum çocuklarda ilerleyen yaşlarda (okul çağında) okuma-yazma hatalarına ve akranları arasında dışlanmaya sebep olabilir. Kocaeli dil ve konuşma terapisti merkezimizde [uzman terapistlerimiz](/ekibimiz), PROMPT tekniği ve çeşitli dil-dudak farkındalık egzersizleriyle bu problemi kısa sürede çözebilmektedir.
    `
  },
  {
    id: '27',
    slug: 'etkilesim-temelli-uygulamalar',
    title: 'Etkileşim Temelli Uygulamalar (DIR Floortime & Hanen)',
    excerpt: 'Gecikmiş dil ve konuşma veya otizm tanılı çocuklarda etkileşim temelli uygulamalar. KODİL merkezimizde oyun ve ilişki odaklı terapiler.',
    category: 'Özel Eğitim',
    date: '25 Tem 2026',
    isoDate: '2026-07-25',
    keywords: ['etkileşim temelli uygulamalar', 'dir floortime', 'hanen programı', 'oyun temelli terapi', 'kocaeli özel eğitim'],
    content: `
Geleneksel "masa başı, ödül-ceza" sistemlerinden farklı olarak, çocuğun liderliğini takip eden ve ilişki kurmayı merkeze alan yöntemlere "Etkileşim Temelli Uygulamalar" diyoruz. Özellikle [otizm spektrum bozukluğu](/blog/otizm-spektrum-bozuklugu-nedir-nedenleri-nelerdir) veya nedeni bilinmeyen [gecikmiş konuşma](/blog/cocugum-konusmuyor-ne-zaman-uzmana-basvurmaliyim) vakalarında dünyada en çok kabul gören yaklaşımlardır.

### KODİL'de Kullandığımız Başlıca Yöntemler:
1. **DIR Floortime:** Çocuğun yerde (floor) kendi oyununa katılarak, onun ilgi alanları üzerinden sosyal ve duygusal gelişim basamaklarını (ortak dikkat, karşılıklı etkileşim, problem çözme) tırmanmasını sağlar.
2. **Hanen (More Than Words) Programı:** Ebeveynlerin çocuğun doğal ortamında nasıl bir dil modeli olması gerektiğini ve oyun oynarken dil gelişimini nasıl destekleyeceklerini öğreten muazzam bir programdır. (Bkz: [Evde Neler Yapabilirsiniz?](/blog/dil-edinimi-ne-zaman-baslar))

Etkileşim temelli bir uygulamanın çocuğa uygun olup olmadığı uzman değerlendirmesiyle belirlenir. Diğer hizmetlerle birlikte sunulması belirli bir sonucu garanti etmez. KODİL’in [hizmet alanları ve randevu bilgileri](/kocaeli-dil-ve-konusma-terapisi) ayrıca incelenebilir.
    `
  },
  {
    id: '28',
    slug: 'cerebral-palysde-eslik-eden-dil-ve-konusma-problemleri-nelerdir',
    title: 'Serebral Palside Eşlik Eden Dil ve Konuşma Problemleri',
    excerpt: 'Serebral Palsi (CP) tanısı alan çocuklarda görülen dizartri, yutma bozukluğu ve iletişim sorunları. Kocaeli dil terapisi uygulamalarımız.',
    category: 'Nörolojik Bozukluklar',
    date: '25 Tem 2026',
    isoDate: '2026-07-25',
    keywords: ['serebral palsi konuşma', 'cerebral palsy', 'serebral palsi yutma bozukluğu', 'kocaeli dil terapisti'],
    content: `
Serebral Palsi (Beyin Felci), gelişmekte olan beynin hasar görmesi sonucu ortaya çıkan, hareket ve postür (duruş) gelişimini etkileyen nörolojik bir tablodur. Beyindeki hasar sadece kol ve bacak kaslarını değil, konuşmayı ve yutmayı sağlayan yüz, dudak, dil ve çene kaslarını da etkiler. Peki "Serebral palysde eşlik eden dil ve konuşma problemleri nelerdir?"

### Başlıca Konuşma ve Yutma Problemleri
1. **[Dizartri (Motor Konuşma Bozukluğu):](/blog/dizartri-nedir)** Konuşma kaslarındaki güçsüzlük, spastisite (kasılma) veya koordinasyon eksikliğine bağlı olarak konuşmanın peltek, yavaş veya aşırı genizden (hımhım) çıkmasıdır.
2. **[Yutma Bozuklukları (Disfaji):](/blog/kocaeli-yutma-bozukluklari-terapisi-disfaji)** Çiğneme güçlüğü, salya akıtma (drooling) ve yiyeceklerin nefes borusuna kaçması gibi hayati risk taşıyan problemler.
3. **Alternatif ve Destekleyici İletişim (ADİS):** Sözel konuşması hiç olmayan ağır CP'li çocuklarda, göz bilgisayarları veya resim değiş-tokuş sistemleri (PECS) kullanılarak çocuğun iletişim kurması sağlanır.

[KODİL fizyoterapi ve özel eğitim birimlerimizle](/kimlere-yardimci-oluyoruz) koordineli bir şekilde serebral palsili çocuklarımızın iletişim potansiyellerini en üst seviyeye çıkarmak için çalışıyoruz.
    `
  },
  {
    id: '29',
    slug: 'dizartri-nedir',
    title: 'Dizartri Nedir? Motor Konuşma Bozukluğu Tedavisi',
    excerpt: 'İnme, MS, Parkinson veya Serebral Palsi sonrası görülen kas güçsüzlüğüne bağlı konuşma bozukluğu: Dizartri nedir ve nasıl tedavi edilir?',
    category: 'Nörolojik Bozukluklar',
    date: '26 Tem 2026',
    isoDate: '2026-07-26',
    keywords: ['dizartri nedir', 'motor konuşma bozukluğu', 'inme konuşma bozukluğu', 'peltek konuşma', 'kocaeli dil terapisti'],
    content: `
Yetişkinlerde beyin kanaması veya felçten sonra sıkça görülen iki büyük iletişim bozukluğu vardır. Birincisi beynin dili anlama ve üretme merkezinin hasar gördüğü [Afazi](/blog/afazi-nedir-inme-felc-sonrasi-konusma-terapisi), ikincisi ise konuşma kaslarının (dil, dudak, damak) güçsüzleştiği veya felç olduğu "Dizartri" durumudur.

### Dizartri Belirtileri Nelerdir?
* Konuşmanın aşırı yavaşlaması ve ağırlaşması
* Peltek veya sarhoşvari (anlaşılamayan) konuşma tarzı
* Sesin çok kısık, pürüzlü veya genizden (hımhım) gelmesi
* Tükürük yutamama veya yeme-içme sırasında boğulma tehlikesi ([Disfaji](/blog/kocaeli-yutma-bozukluklari-terapisi-disfaji))

Parkinson, Multipl Skleroz (MS) gibi ilerleyici nörolojik hastalıklarda da dizartri oldukça yaygındır. Kocaeli dil ve konuşma terapisti merkezimizde [uzman kadromuz](/ekibimiz), solunum ve ses egzersizleri, artikülasyon kaslarını güçlendirme çalışmaları ve konuşma hızını yavaşlatma stratejileriyle dizartri tedavisinde yüksek başarı oranlarına ulaşmaktadır.
    `
  },
  {
    id: '30',
    slug: 'down-sendromu-nedir',
    title: 'Down Sendromu Nedir? Dil ve Konuşma Terapisinin Rolü',
    excerpt: 'Down sendromu (Trisomi 21) nedir? Down sendromlu çocuklarda konuşma gecikmesi, kas hipotonisi ve erken müdahale yaklaşımları.',
    category: 'Özel Eğitim',
    date: '26 Tem 2026',
    isoDate: '2026-07-26',
    keywords: ['down sendromu nedir', 'down sendromu konuşma', 'trisomi 21', 'kocaeli özel eğitim', 'kocaeli dil terapisti'],
    content: `
Kromozomal bir anomali olan ve bireyde fazladan bir 21. kromozom bulunmasıyla (Trisomi 21) ortaya çıkan farklılığa "Down Sendromu" denir. Dünyanın her yerinde "Down sendromu nedir?" sorusunun en güzel cevabı, onların bizden "bir fazlası" olduğudur.

### Down Sendromunda Konuşma Gelişimi
Down sendromlu bireyler mükemmel bir sosyal etkileşim kapasitesine sahiptirler ancak fizyolojik yapıları gereği konuşma üretiminde bazı bariyerlerle karşılaşırlar:
1. **Hipotonik Kas Yapısı:** Dil, dudak ve çene kaslarındaki zayıflık (gevşeklik), harfleri net üretmelerini engeller (Bkz: [Artikülasyon Bozukluğu](/blog/artikulasyon-bozuklugu-nedir-harfleri-soyleyememe)).
2. **Anatomik Farklılıklar:** Göreceli olarak daha büyük dil yapısı ve dar damak kubbesi.
3. **[Gecikmiş Dil Gelişimi:](/blog/cocugum-konusmuyor-ne-zaman-uzmana-basvurmaliyim)** Zihinsel öğrenme süreçlerinin yaşıtlarına göre daha yavaş seyretmesi.

Down sendromlu çocukların iletişim ve günlük yaşam ihtiyaçları bireyseldir. Çocuğunuzun doktoru ve ilgili uzmanlarla konuşarak hangi değerlendirme veya desteğin uygun olacağını öğrenin. KODİL, Kartepe/Kocaeli’de dil ve konuşma terapisi ile ergoterapi hizmetleri sunar; [hizmet kapsamı ve randevu bilgisi](/kocaeli-dil-ve-konusma-terapisi) için merkezle görüşebilirsiniz.
    `
  },
  {
    id: '31',
    slug: 'elektronik-cihazin-konusmaya-etkisi',
    title: 'Elektronik Cihazın Konuşmaya Etkisi: Ekran Maruziyeti',
    excerpt: 'Ekran kullanımı, ebeveyn-çocuk etkileşimi ve konuşma gelişimi: aileler medya alışkanlıklarını nasıl değerlendirebilir?',
    category: 'Çocuk Gelişimi',
    date: '27 Tem 2026',
    isoDate: '2026-07-27',
    keywords: ['ekran maruziyeti', 'elektronik cihazın konuşmaya etkisi', 'çocuklarda iletişim gelişimi', 'kocaeli dil terapisti'],
    content: `
Ebeveynler ekran kullanımı ile konuşma gelişimi arasında ilişki olup olmadığını merak edebilir. Ekran süresi tek başına bir çocuğun konuşma güçlüğünün nedenini veya tanısını açıklamaz. Çocuğunuzun iletişim gelişimiyle ilgili kaygınız varsa bunu doktoruyla paylaşın; ekran kullanımı, birlikte oyun ve günlük konuşma fırsatları dahil çocuğun rutinini de anlatın.

### Günlük rutinde neler düşünülebilir?
Ekran kullanımına ilişkin yaklaşım çocuğun yaşına, kullanılan içeriğe ve aile rutinlerine göre değişebilir. Aileler birlikte izleme, cihazsız sohbet ve yemek zamanları, kitap okuma ve oyun gibi yüz yüze etkinliklere alan açmayı düşünebilir. Amerikan Pediatri Akademisi, ailelerin kendi rutinlerine uygun bir medya planı oluşturmasını önerir: [Aile medya planı](https://www.healthychildren.org/English/family-life/Media/Pages/How-to-Make-a-Family-Media-Use-Plan.aspx).

Çocuğun konuşma veya iletişim gelişimiyle ilgili kaygınız varsa yalnızca ekranı azaltmanın yeterli olacağını varsaymayın; doktorunuza danışın. Dil ve konuşma terapisti değerlendirmesi hakkında bilgi için KODİL’in [Kartepe/Kocaeli hizmet ve randevu sayfasını](/kocaeli-dil-ve-konusma-terapisi) inceleyebilirsiniz.
    `
  }
]
