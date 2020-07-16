import { CategoryContent } from './categories'
import { DEFAULT_LOCALE } from './constants'

export interface PostContent {
  id: string
  createdAt: string
  title: {
    [DEFAULT_LOCALE]: string
    [locale: string]: string
  }
  description: {
    [DEFAULT_LOCALE]: string
    [locale: string]: string
  }
  featuredImage: {
    url: string
  }
  content: {
    [DEFAULT_LOCALE]: string
    [locale: string]: string
  }
  category: CategoryContent
}

interface Child {
  getAllPostContentsPerLocale(): Promise<{
    [locale: string]: PostContent[]
  }>
}

let child: Child | null = null

async function getChild() {
  if (child) return child
  if (!process.env.NUXT_ENV_CONTENT_API_DIR_NAME)
    throw new Error('Content API type is not defined')
  child = (await import(
    `./${process.env.NUXT_ENV_CONTENT_API_DIR_NAME}/posts.ts`
  )) as Child
  return child
}

export async function getAllPostContentsPerLocale() {
  const { getAllPostContentsPerLocale } = await getChild()
  const result = await getAllPostContentsPerLocale()
  return result
}
