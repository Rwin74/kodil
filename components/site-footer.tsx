import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

// Custom SVG Icons for social media to avoid lucide-react version conflicts
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
)

export function SiteFooter() {
  const quickLinks = [
    { label: "Anasayfa", href: "/" },
    { label: "Ekibimiz", href: "/ekibimiz" },
    { label: "Blog & Kaynaklar", href: "/blog" },
    { label: "Kimlere Yardımcı Oluyoruz?", href: "/kimlere-yardimci-oluyoruz" },
    { label: "İletişim", href: "/iletisim" },
  ]

  const services = [
    { label: "Dil ve Konuşma Terapisi", href: "/blog/kocaeli-dil-ve-konusma-terapisti-neden-erken-mudahale" },
    { label: "Ergoterapi", href: "/blog/kocaeli-ergoterapi" },
    { label: "Oyun Terapisi", href: "/blog/psikoterapi-yontemleri-ve-uygulama-asamalari-nedir" },
    { label: "Kekemelik Tedavisi", href: "/blog/kocaeli-kekemelik-tedavisi-akici-konusma" },
    { label: "Otizm Erken Müdahale", href: "/blog/otizm-spektrum-bozuklugu-nedir-nedenleri-nelerdir" },
  ]

  return (
    <footer className="relative overflow-hidden bg-background py-16">
      {/* Top subtle border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 border-b border-border pb-16 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand & Info */}
          <div className="flex flex-col">
            <Link href="/" className="inline-block">
              <Image
                src="/images/son-logo.webp"
                alt="KODİL Logo"
                width={180}
                height={60}
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              En iyi Kocaeli dil ve konuşma terapisti uzmanlarımızla, her sese değer veren çocuk odaklı bir gelişim merkezi.
            </p>
            <div className="mt-8 flex gap-4">
              <a href="https://www.instagram.com/kocaelidilkonusmamerkezi/" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/5 text-secondary transition-colors hover:bg-primary hover:text-white">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/people/Kocaeli-Dil-Konu%C5%9Fma-ve-Ergoterapi-Merkezi/61581354345505/" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/5 text-secondary transition-colors hover:bg-primary hover:text-white">
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-secondary">Hızlı Menü</h3>
            <ul className="mt-6 flex flex-col gap-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-secondary">Hizmetlerimiz</h3>
            <ul className="mt-6 flex flex-col gap-3">
              {services.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-secondary">İletişim Bilgileri</h3>
            <ul className="mt-6 flex flex-col gap-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>
                  Altek Plaza, Dumlupınar, Şht. Turgut Çiçek Cad.<br />
                  D:3. Kat B12, 41250<br />
                  Kartepe, Kocaeli
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <a href="tel:+905015640041" className="hover:text-primary transition-colors">0501 564 00 41</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <a href="mailto:yardenegitim@gmail.com" className="hover:text-primary transition-colors">yardenegitim@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} KODİL Kocaeli Dil ve Konuşma Terapisi Merkezi. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest">
            <span>Kartepe</span>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span>Kocaeli</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

