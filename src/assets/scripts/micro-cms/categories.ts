import axios from 'axios'
import { CategoryContent } from '../categories'
import { MAX_API_GET_REQUEST_LIMIT } from '../constants'
import { createCategoriesRequestConfig } from './request-config'
import { MicroCmsQuery } from './query'
import { MicroCmsListResponse } from './response'

async function getCategoryContentList(params: MicroCmsQuery = {}) {
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
