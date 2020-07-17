import { PlainTextContent } from './plain-text'
import { ImageContent } from './images'

export interface SiteDataContent {
  title: PlainTextContent
  description: PlainTextContent
  ogImage: ImageContent
}

interface Child {
  getSiteDataContent(): Promise<SiteDataContent>
}

let child: Child | null = null

async function getChild() {
  if (child) return child
  child = (await import(
    `./${process.env.NUXT_ENV_CONTENT_API_DIR_NAME}/site-data.ts`
  )) as Child
  return child
}

export async function getSiteDataContent() {
  const { getSiteDataContent } = await getChild()
  const result = await getSiteDataContent()
  return result
}
