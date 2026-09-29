import 'server-only'

import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { getContentRepository } from '@/lib/content/repository'

export async function redirectFromPathOrNotFound(sourcePath: string): Promise<never> {
  const match = await (await getContentRepository()).getRedirectBySourcePath(sourcePath)
  if (!match) notFound()
  if (match.httpCode === 308) permanentRedirect(match.targetPath)
  redirect(match.targetPath)
}
