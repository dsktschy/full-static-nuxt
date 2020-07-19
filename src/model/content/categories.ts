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
  child = (await import(
    `./${process.env.NUXT_ENV_CONTENT_API_DIR_NAME}/categories.ts`
  )) as Child
  return child
}

export async function getAllCategoryContents() {
  const { getAllCategoryContents } = await getChild()
  const result = await getAllCategoryContents()
  return result
}
