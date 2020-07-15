import { DEFAULT_LOCALE } from './constants'

export interface RichTextContent {
  id: string
  value: {
    [DEFAULT_LOCALE]: string
    [locale: string]: string
  }
}

interface Child {
  getAllRichTextContents(): Promise<RichTextContent[]>
}

let child: Child | null = null

async function getChild() {
  if (child) return child
  if (!process.env.NUXT_ENV_CONTENT_API_TYPE)
    throw new Error('Content API type is not defined')
  child = (await import(
    `./${process.env.NUXT_ENV_CONTENT_API_TYPE}/rich-text.ts`
  )) as Child
  return child
}

export async function getAllRichTextContents() {
  const { getAllRichTextContents } = await getChild()
  const result = await getAllRichTextContents()
  return result
}
