import { DEFAULT_LOCALE } from './constants'

export interface PlainTextContent {
  id: string
  value: {
    [DEFAULT_LOCALE]: string
    [locale: string]: string
  }
}

interface Child {
  getAllPlainTextContents(): Promise<PlainTextContent[]>
}

let child: Child | null = null

async function getChild() {
  if (child) return child
  if (!process.env.NUXT_ENV_CONTENT_API_TYPE)
    throw new Error('Content API type is not defined')
  child = (await import(
    `./${process.env.NUXT_ENV_CONTENT_API_TYPE}/plain-text.ts`
  )) as Child
  return child
}

export async function getAllPlainTextContents() {
  const { getAllPlainTextContents } = await getChild()
  const result = await getAllPlainTextContents()
  return result
}
