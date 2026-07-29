import { Hero } from '@/components/hero'
import { WhoWeHelp } from '@/components/who-we-help'
import { TherapyJourney } from '@/components/therapy-journey'
import { Experts } from '@/components/experts'
import { Stats } from '@/components/stats'
import { SuccessStories } from '@/components/success-stories'
import { Process } from '@/components/process'
import { Timeline } from '@/components/timeline'
import { Faq } from '@/components/faq'
import { Contact } from '@/components/contact'

export default function Page() {
  return (
    <>
      <Hero />
      <WhoWeHelp />
      <TherapyJourney />
      <Experts />
      <Stats />
      <SuccessStories />
      <Timeline />
      <Process />
      <Faq />
      <Contact />
    </>
  )
}
