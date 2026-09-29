/**
 * Sitedeki tüm SSS bölümlerinin ve FAQPage yapısal verisinin tek kaynağı.
 * Yapısal verinin görünen içerikle birebir aynı kalması için buradan beslenir.
 */
export interface FaqItem {
  question: string
  answer: string
}

export const faqs: FaqItem[] = [
  {
    question: "Çocuğum geç konuşuyor, ne yapmalıyım? Beklemeli miyim?",
    answer: "Geç konuşma ihmal edilmemesi gereken bir durumdur. 'Bekleyelim geçer' yaklaşımı yerine ihtiyaçların erken dönemde değerlendirilmesi, uygun destek planının zamanında kurulmasına yardımcı olabilir.",
  },
  {
    question: "Konuşma terapisine kaç yaşında başlanır?",
    answer: "Dil ve konuşma değerlendirmesi için tek bir başlangıç yaşı yoktur. Zamanlama; gelişimsel özellikler, gözlenen durum ve kişinin ihtiyaçlarına göre belirlenir. Erken değerlendirme uygun destek seçeneklerinin zamanında planlanmasına yardımcı olabilir, ancak belirli bir sonuç garanti etmez.",
  },
  {
    question: "Çocuğum söylenenleri anlıyor ama konuşmuyor, nedeni nedir?",
    answer: "Bu durum, alıcı dil (anlama) gelişiminin iyi, ancak ifade edici dilin (konuşma) zayıf olmasından kaynaklanabilir. Kocaeli dil ve konuşma terapisi seanslarımızda bu alanlar ayrı ayrı değerlendirilerek iletişimi güçlendirecek özel bir yol haritası çizilir.",
  },
  {
    question: "Kekemelik geçer mi? Terapisi nasıl uygulanır?",
    answer: "Kekemeliğin seyri ve günlük yaşama etkisi kişiden kişiye değişir. Değerlendirme sonrasında yaşa, iletişim özelliklerine ve kişinin hedeflerine uygun bir çalışma planı oluşturulabilir; hiçbir yaklaşım herkeste aynı sonucu garanti etmez.",
  },
  {
    question: "Duyu bütünleme bozukluğu belirtileri nelerdir?",
    answer: "Sese veya dokunmaya yoğun tepki, hareket arayışı, dikkat ve koordinasyon güçlükleri değerlendirmede ele alınabilecek durumlardır. Bu belirtiler tek başına tanı koydurmaz; destek planı ve gözlenebilecek değişimler bireysel değerlendirmeye göre farklılaşır.",
  },
  {
    question: "Konuşma terapisi oyunla mı yapılır?",
    answer: "Çocuklarla yürütülen dil ve konuşma çalışmalarında oyun temelli etkinlikler kullanılabilir. Kullanılacak yöntem çocuğun yaşı, ilgileri, iletişim özellikleri ve değerlendirme sonuçlarına göre belirlenir.",
  },
  {
    question: "Çocuğum bazı harfleri (R, S, K vb.) söyleyemiyor, ne yapmalıyım?",
    answer: "Artikülasyon bozukluğu olarak adlandırılan bu durum, seslerin yanlış veya eksik üretilmesidir. Değerlendirme sonrasında kişinin ihtiyacına göre bireysel bir terapi programı planlanabilir.",
  },
  {
    question: "Terapi seansları ne kadar sürer ve ne sıklıkla gelinmelidir?",
    answer: "Seans süresi ve sıklığı; ihtiyaca, değerlendirme bulgularına ve izlem sırasında verilen yanıta göre değişir. Önerilen plan düzenli aralıklarla yeniden değerlendirilmelidir; belirli bir süre veya sonucun kalıcılığı önceden vaat edilemez.",
  },
  {
    question: "Kocaeli dil ve konuşma terapisi veya ergoterapi randevusu nasıl alınır?",
    answer: "Sitemizdeki iletişim formu, WhatsApp veya telefon numaramız üzerinden bizimle iletişime geçerek ön değerlendirme randevusu oluşturabilirsiniz. Görüşme sonrasında ihtiyaçlara uygun süreç hakkında bilgi paylaşılır.",
  },
]
