import type { Metadata } from 'next'
import { absoluteUrl, type PageSeo, SITE } from '@/lib/site'

/** Statik sayfalarda canonical, Open Graph ve Twitter URL'lerini aynı kaynaktan üretir. */
export function metadataForPage(page: PageSeo): Metadata {
  const url = absoluteUrl(page.path)
  const image = absoluteUrl(SITE.primaryImage.path)

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.path,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: SITE.shortName,
      locale: 'tr_TR',
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [image],
    },
  }
}
