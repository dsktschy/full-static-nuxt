import { DEFAULT_LOCALE } from '../../constants/index'

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
  child = (await import(
    `./${process.env.NUXT_ENV_CONTENT_API_DIR_NAME}/rich-text.ts`
  )) as Child
  return child
}

export async function getAllRichTextContents() {
  const { getAllRichTextContents } = await getChild()
  const result = await getAllRichTextContents()
  return result
}
