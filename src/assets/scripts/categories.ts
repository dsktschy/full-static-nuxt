import axios from 'axios'
import { createCategoriesRequestConfig } from './request-config'
import { MicroCmsQuery, MicroCmsListResponse } from './micro-cms'
import { PlainTextContent } from './plain-text'
import { MAX_API_GET_REQUEST_LIMIT } from './constants'

export interface CategoryContent {
  id: string
  name: PlainTextContent
}

export async function getCategoryContentList(params: MicroCmsQuery = {}) {
  const config = createCategoriesRequestConfig(params)
  const response = await axios.get<MicroCmsListResponse<CategoryContent>>(
    '',
    config
  )
  return response.data.contents
}

export async function getAllCategoryContents() {
  const allCategoryContents: CategoryContent[] = []
  let categoryContentList: CategoryContent[] = []
  do {
    categoryContentList = await getCategoryContentList({
      limit: MAX_API_GET_REQUEST_LIMIT,
      offset: allCategoryContents.length
    })
    allCategoryContents.push(...categoryContentList)
  } while (categoryContentList.length === MAX_API_GET_REQUEST_LIMIT)
  return allCategoryContents
}
