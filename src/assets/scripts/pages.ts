import { PlainTextContent } from './plain-text'
import { RichTextContent } from './rich-text'
import { ImageContent } from './images'

export interface PageContent {
  id: string
  path?: string
  title: PlainTextContent
  description: PlainTextContent | null
  ogImage: ImageContent | null
  plainText: PlainTextContent[]
  richText: RichTextContent[]
  images: ImageContent[]
}

interface Child {
  getPageContent(id: string): Promise<PageContent>
  getAllPageContentsForNav(): Promise<PageContent[]>
}

let child: Child | null = null

async function getChild() {
  if (child) return child
  if (!process.env.NUXT_ENV_CONTENT_API_TYPE)
    throw new Error('Content API type is not defined')
  child = (await import(
    `./${process.env.NUXT_ENV_CONTENT_API_TYPE}/pages.ts`
  )) as Child
  return child
}

export async function getPageContent(id: string) {
  const { getPageContent } = await getChild()
  const result = await getPageContent(id)
  return result
}

export async function getAllPageContentsForNav() {
  const { getAllPageContentsForNav } = await getChild()
  const result = await getAllPageContentsForNav()
  return result
}
