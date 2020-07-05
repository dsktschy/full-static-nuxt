import axios from 'axios'
import { categoriesPerRequest } from '../json/variables.json'
import { createCategoriesRequestConfig } from './request-config'
import { MicroCmsQuery, MicroCmsListResponse } from './micro-cms'
import { PlainTextContent } from './plain-text'

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
  const allCategoryContents = []
  let categoryContentList = []
  do {
    categoryContentList = await getCategoryContentList({
      limit: categoriesPerRequest,
      offset: allCategoryContents.length
    })
    allCategoryContents.push(...categoryContentList)
  } while (categoryContentList.length === categoriesPerRequest)
  return allCategoryContents
}
