"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/motion-primitives"

const channels = [
  { 
    icon: MapPin, 
    label: "Konum", 
    value: "Altek Plaza, Dumlupınar, Şht. Turgut Çiçek Cad. D:3. Kat B12, 41250 Kartepe/Kocaeli", 
    href: "https://maps.google.com/?q=Altek+Plaza,+Dumlupınar,+Şht.+Turgut+Çiçek+Cad.+Kartepe/Kocaeli" 
  },
  { 
    icon: Clock, 
    label: "Çalışma Saatleri", 
    value: (
      <span className="text-base">
        Haftaiçi : 12.00 - 20.00<br/>
        Haftasonu : 10.00 - 20.00<br/>
        <span className="text-sm opacity-80">*Randevulu çalışılmaktadır.</span>
      </span>
    )
  },
  { 
    icon: Phone, 
    label: "Telefon", 
    value: "0501 564 00 41", 
    href: "tel:+905015640041" 
  },
  { 
    icon: Mail, 
    label: "E-mail", 
    value: "yardenegitim@gmail.com", 
    href: "mailto:yardenegitim@gmail.com" 
  },
]

const socials = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/905015640041',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    )
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/people/Kocaeli-Dil-Konu%C5%9Fma-ve-Ergoterapi-Merkezi/61581354345505/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/kocaelidilkonusmamerkezi/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    )
  }
]

export function Contact() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')
    const phone = formData.get('phone')
    const email = formData.get('email')
    const message = formData.get('message')
    
    const body = `İsim: ${name}\nTelefon: ${phone}\nE-posta: ${email}\n\nMesaj:\n${message}`
    window.location.href = `mailto:ceylanenes29@gmail.com?subject=Kodil İletişim Formu Mesajı&body=${encodeURIComponent(body)}`
    
    setSent(true)
  }

  return (
    <section id="iletisim" className="relative overflow-hidden bg-secondary py-24 text-secondary-foreground md:py-36">
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full opacity-20 bg-[radial-gradient(circle,var(--color-primary)_0%,transparent_60%)]" aria-hidden />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <div>
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Size Ulaşalım</span>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-balance md:text-6xl">
                Bir merhaba ile <span className="italic text-primary">başlayalım</span>.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-secondary-foreground/70">
                Sorularınız, kaygılarınız ya da sadece bir sohbet için — kapımız açık. Formu doldurun, en kısa sürede
                size dönüş yapalım.
              </p>
            </Reveal>

            <div className="mt-12 flex flex-col gap-4">
              {channels.map((c, i) => {
                const Wrapper = c.href ? "a" : "div"
                return (
                  <Reveal key={c.label} delay={i * 0.08}>
                    <Wrapper
                      {...(c.href ? { href: c.href, target: c.href.startsWith('http') ? '_blank' : undefined, rel: "noreferrer" } : {})}
                      className="group flex items-center gap-4 rounded-2xl border border-secondary-foreground/10 bg-secondary-foreground/5 px-5 py-4 transition-colors hover:border-primary/50"
                    >
                      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primary/15 text-primary">
                        <c.icon className="h-5 w-5" />
                      </span>
                      <span className="flex flex-col">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-secondary-foreground/50">
                          {c.label}
                        </span>
                        <span className="text-lg leading-snug">{c.value}</span>
                      </span>
                      {c.href && (
                        <ArrowUpRight className="ml-auto h-5 w-5 flex-none text-secondary-foreground/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                      )}
                    </Wrapper>
                  </Reveal>
                )
              })}
            </div>

            <Reveal delay={0.3}>
              <div className="mt-12">
                <h3 className="font-serif text-2xl text-secondary">Sosyal Medya</h3>
                <div className="mt-6 flex flex-wrap gap-4">
                  {socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.name}
                      className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-primary text-primary-foreground transition-all hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] rounded-tr-[5rem] border border-secondary-foreground/10 bg-background p-8 text-foreground md:p-10"
            >
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full min-h-[380px] flex-col items-center justify-center text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-3xl text-primary">
                    ✓
                  </span>
                  <h3 className="mt-6 font-serif text-2xl text-secondary">Teşekkür ederiz!</h3>
                  <p className="mt-2 max-w-xs text-muted-foreground">
                    Mesajınız bize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.
                  </p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-5">
                  <Field label="Adınız Soyadınız" name="name" placeholder="Adınızı yazın" />
                  <Field label="Telefon" name="phone" type="tel" placeholder="+90 ..." />
                  <Field label="E-posta" name="email" type="email" placeholder="ornek@eposta.com" />
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Mesajınız
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Size nasıl yardımcı olabiliriz?"
                      className="resize-none rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    Mesajı Gönder
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
      />
    </div>
  )
}
