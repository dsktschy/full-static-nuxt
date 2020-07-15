import { PlainTextContent } from './plain-text'

export interface CategoryContent {
  id: string
  name: PlainTextContent
}

interface Child {
  getAllCategoryContents(): Promise<CategoryContent[]>
}

let child: Child | null = null

async function getChild() {
  if (child) return child
  if (!process.env.NUXT_ENV_CONTENT_API_TYPE)
    throw new Error('Content API type is not defined')
  child = (await import(
    `./${process.env.NUXT_ENV_CONTENT_API_TYPE}/categories.ts`
  )) as Child
  return child
}

export async function getAllCategoryContents() {
  const { getAllCategoryContents } = await getChild()
  const result = await getAllCategoryContents()
  return result
}
